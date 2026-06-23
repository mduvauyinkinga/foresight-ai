import { useEffect, useState } from "react";
import { PAIRS, type Pair } from "./forex-data";

type LiveMap = Record<string, { price: number; change: number }>;

const FRANKFURTER_PAIRS: Record<string, { from: string; to: string }> = {
  "EUR/USD": { from: "EUR", to: "USD" },
  "GBP/USD": { from: "GBP", to: "USD" },
  "USD/JPY": { from: "USD", to: "JPY" },
};

async function fetchFx(from: string, to: string): Promise<{ price: number; change: number } | null> {
  try {
    const today = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`).then((r) => r.json());
    const price = today?.rates?.[to];
    if (!price) return null;
    const yDate = new Date(Date.now() - 86_400_000 * 2).toISOString().slice(0, 10);
    const yest = await fetch(`https://api.frankfurter.dev/v1/${yDate}?base=${from}&symbols=${to}`).then((r) => r.json());
    const prev = yest?.rates?.[to] ?? price;
    return { price, change: +(((price - prev) / prev) * 100).toFixed(2) };
  } catch {
    return null;
  }
}

async function fetchBtc(): Promise<{ price: number; change: number } | null> {
  try {
    const r = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true",
    ).then((r) => r.json());
    const p = r?.bitcoin;
    if (!p) return null;
    return { price: Math.round(p.usd), change: +Number(p.usd_24h_change ?? 0).toFixed(2) };
  } catch {
    return null;
  }
}

async function fetchGold(): Promise<{ price: number; change: number } | null> {
  try {
    const r = await fetch("https://api.gold-api.com/price/XAU").then((r) => r.json());
    const price = Number(r?.price);
    if (!price) return null;
    return { price: +price.toFixed(2), change: 0 };
  } catch {
    return null;
  }
}

export function applyLive(pair: Pair, live?: { price: number; change: number }): Pair {
  if (!live) return pair;
  const entryOff = pair.entry - pair.price;
  const tpOff = pair.takeProfit - pair.price;
  const slOff = pair.stopLoss - pair.price;
  const round = (n: number) => +n.toFixed(pair.price > 100 ? 2 : 4);
  return {
    ...pair,
    price: live.price,
    change: live.change || pair.change,
    entry: round(live.price + entryOff),
    takeProfit: round(live.price + tpOff),
    stopLoss: round(live.price + slOff),
  };
}

export function useLivePrices() {
  const [live, setLive] = useState<LiveMap>({});
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const entries = await Promise.all([
        ...Object.entries(FRANKFURTER_PAIRS).map(async ([sym, { from, to }]) => {
          const r = await fetchFx(from, to);
          return r ? ([sym, r] as const) : null;
        }),
        (async () => {
          const r = await fetchGold();
          return r ? (["XAU/USD", r] as const) : null;
        })(),
        (async () => {
          const r = await fetchBtc();
          return r ? (["BTC/USD", r] as const) : null;
        })(),
      ]);
      if (cancelled) return;
      const map: LiveMap = {};
      for (const e of entries) if (e) map[e[0]] = e[1];
      setLive(map);
      setUpdatedAt(new Date());
      setLoading(false);
      setError(Object.keys(map).length === 0 ? "Live feed unavailable" : null);
    }
    load();
    const id = setInterval(load, 60_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const pairs = PAIRS.map((p) => applyLive(p, live[p.symbol]));
  return { pairs, loading, updatedAt, error, hasLive: (sym: string) => Boolean(live[sym]) };
}