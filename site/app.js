// KTM Tech Forex Analysis — static app logic

const BASE_PAIRS = [
  { symbol: "EUR/USD", name: "Euro / US Dollar", price: 1.0921, change: 0.34, signal: "BUY", confidence: 87, risk: "Low", rsi: 61, macd: "Bullish",
    entry: 1.0910, takeProfit: 1.0965, stopLoss: 1.0880,
    reasons: ["Bullish MACD crossover", "RSI recovering from oversold", "USD weakness on CPI miss", "Higher-low market structure"] },
  { symbol: "GBP/USD", name: "British Pound / US Dollar", price: 1.2734, change: -0.21, signal: "SELL", confidence: 79, risk: "Medium", rsi: 38, macd: "Bearish",
    entry: 1.2740, takeProfit: 1.2680, stopLoss: 1.2770,
    reasons: ["Bearish MACD", "Rejected at 1.2760 resistance", "Negative UK retail sentiment"] },
  { symbol: "USD/JPY", name: "US Dollar / Japanese Yen", price: 154.82, change: 0.12, signal: "HOLD", confidence: 54, risk: "High", rsi: 52, macd: "Neutral",
    entry: 154.80, takeProfit: 155.40, stopLoss: 154.20,
    reasons: ["Range-bound between 154.20–155.40", "BoJ intervention risk", "Mixed momentum"] },
  { symbol: "AUD/USD", name: "Australian Dollar / US Dollar", price: 0.6612, change: 0.18, signal: "BUY", confidence: 71, risk: "Medium", rsi: 58, macd: "Bullish",
    entry: 0.6608, takeProfit: 0.6660, stopLoss: 0.6582,
    reasons: ["Commodity strength", "RBA hawkish tone", "Bullish EMA cross"] },
  { symbol: "USD/CHF", name: "US Dollar / Swiss Franc", price: 0.8853, change: -0.09, signal: "SELL", confidence: 65, risk: "Medium", rsi: 44, macd: "Bearish",
    entry: 0.8855, takeProfit: 0.8810, stopLoss: 0.8880,
    reasons: ["Safe-haven bid for CHF", "Lower high formation", "Momentum fading"] },
  { symbol: "XAU/USD", name: "Gold Spot", price: 2348.50, change: 1.08, signal: "BUY", confidence: 92, risk: "Low", rsi: 64, macd: "Bullish",
    entry: 2346.0, takeProfit: 2378.0, stopLoss: 2330.0,
    reasons: ["Safe-haven demand rising", "USD index breakdown", "Bullish EMA 20/50 cross", "Strong volume confirmation"] },
  { symbol: "BTC/USD", name: "Bitcoin / US Dollar", price: 67842, change: 2.41, signal: "BUY", confidence: 81, risk: "High", rsi: 68, macd: "Bullish",
    entry: 67500, takeProfit: 71000, stopLoss: 65800,
    reasons: ["Breakout above 67k", "ETF inflows accelerating", "Momentum aligned"] },
];

const STRENGTH = [
  { code: "USD", value: 82 }, { code: "EUR", value: 71 }, { code: "GBP", value: 67 },
  { code: "JPY", value: 39 }, { code: "AUD", value: 58 }, { code: "CHF", value: 63 },
  { code: "CAD", value: 55 }, { code: "NZD", value: 47 },
];

const CALENDAR = [
  { time: "08:30", currency: "USD", impact: "High", event: "Non-Farm Payrolls" },
  { time: "10:00", currency: "EUR", impact: "Medium", event: "ECB President Speech" },
  { time: "14:00", currency: "USD", impact: "High", event: "FOMC Rate Decision" },
  { time: "23:50", currency: "JPY", impact: "Medium", event: "BoJ Core CPI" },
  { time: "06:00", currency: "GBP", impact: "High", event: "UK CPI y/y" },
];

// ====== Live price fetching ======
const FX_MAP = {
  "EUR/USD": { from: "EUR", to: "USD" },
  "GBP/USD": { from: "GBP", to: "USD" },
  "USD/JPY": { from: "USD", to: "JPY" },
  "AUD/USD": { from: "AUD", to: "USD" },
  "USD/CHF": { from: "USD", to: "CHF" },
};

async function fetchFx(from, to) {
  try {
    const today = await fetch(`https://api.frankfurter.dev/v1/latest?base=${from}&symbols=${to}`).then(r => r.json());
    const price = today?.rates?.[to];
    if (!price) return null;
    const d = new Date(Date.now() - 86400000 * 2).toISOString().slice(0, 10);
    const yest = await fetch(`https://api.frankfurter.dev/v1/${d}?base=${from}&symbols=${to}`).then(r => r.json());
    const prev = yest?.rates?.[to] ?? price;
    return { price, change: +(((price - prev) / prev) * 100).toFixed(2) };
  } catch { return null; }
}

async function fetchBtc() {
  try {
    const r = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd&include_24hr_change=true").then(r => r.json());
    if (!r?.bitcoin) return null;
    return { price: Math.round(r.bitcoin.usd), change: +Number(r.bitcoin.usd_24h_change ?? 0).toFixed(2) };
  } catch { return null; }
}

async function fetchGold() {
  try {
    const r = await fetch("https://api.gold-api.com/price/XAU").then(r => r.json());
    const price = Number(r?.price);
    if (!price) return null;
    return { price: +price.toFixed(2), change: 0 };
  } catch { return null; }
}

async function fetchAllLive() {
  const out = {};
  const jobs = [
    ...Object.entries(FX_MAP).map(async ([sym, m]) => { const r = await fetchFx(m.from, m.to); if (r) out[sym] = r; }),
    (async () => { const r = await fetchGold(); if (r) out["XAU/USD"] = r; })(),
    (async () => { const r = await fetchBtc(); if (r) out["BTC/USD"] = r; })(),
  ];
  await Promise.all(jobs);
  return out;
}

function applyLive(pair, live) {
  if (!live) return { ...pair, live: false };
  const eOff = pair.entry - pair.price;
  const tOff = pair.takeProfit - pair.price;
  const sOff = pair.stopLoss - pair.price;
  const dec = pair.price > 100 ? 2 : 4;
  const round = n => +n.toFixed(dec);
  return {
    ...pair, live: true,
    price: live.price,
    change: live.change || pair.change,
    entry: round(live.price + eOff),
    takeProfit: round(live.price + tOff),
    stopLoss: round(live.price + sOff),
  };
}

async function loadPairs() {
  const live = await fetchAllLive();
  return BASE_PAIRS.map(p => applyLive(p, live[p.symbol]));
}

// ====== Rendering helpers ======
function fmtPrice(n) {
  return n >= 1000 ? n.toLocaleString(undefined, { maximumFractionDigits: 2 }) : n.toFixed(n >= 10 ? 2 : 4);
}
function badgeClass(sig) { return sig === "BUY" ? "buy" : sig === "SELL" ? "sell" : "hold"; }

function pairCardHTML(p) {
  const liveTag = p.live ? '<span class="live-tag">LIVE</span>' : "";
  return `<div class="glass pair-card">
    <div class="pair-head">
      <div>
        <div class="pair-sym">${p.symbol}${liveTag}</div>
        <div class="pair-name">${p.name}</div>
      </div>
      <span class="badge ${badgeClass(p.signal)}">${p.signal}</span>
    </div>
    <div class="price-row">
      <span class="price">${fmtPrice(p.price)}</span>
      <span class="change ${p.change >= 0 ? "up" : "down"}">${p.change >= 0 ? "+" : ""}${p.change}%</span>
    </div>
    <div class="meta">
      <div class="row"><span>Confidence</span><span>${p.confidence}%</span></div>
      <div class="bar"><span style="width:${p.confidence}%"></span></div>
      <div class="row" style="margin-top:8px"><span>Risk</span><span style="color:${p.risk === 'Low' ? 'var(--success)' : p.risk === 'High' ? 'var(--danger)' : 'var(--warning)'}">${p.risk}</span></div>
    </div>
  </div>`;
}

function signalCardHTML(p) {
  const rr = (Math.abs(p.takeProfit - p.entry) / Math.abs(p.entry - p.stopLoss)).toFixed(2);
  const liveTag = p.live ? '<span class="live-tag">LIVE</span>' : "";
  return `<div class="glass signal-card" style="margin-bottom:16px">
    <div class="signal-head">
      <div>
        <div class="pair-sym" style="font-size:20px">${p.symbol}${liveTag}</div>
        <div class="pair-name">${p.name}</div>
      </div>
      <div style="display:flex;align-items:center;gap:18px">
        <span class="badge ${badgeClass(p.signal)}" style="font-size:13px;padding:6px 14px">${p.signal}</span>
        <div style="text-align:right">
          <div style="font-size:11px;color:var(--muted)">Confidence</div>
          <div style="color:var(--primary);font-weight:700">${p.confidence}%</div>
        </div>
      </div>
    </div>
    <div class="stats">
      <div class="stat"><div class="lbl">Live Price</div><div class="val">${fmtPrice(p.price)}</div></div>
      <div class="stat"><div class="lbl">Entry</div><div class="val">${fmtPrice(p.entry)}</div></div>
      <div class="stat"><div class="lbl">Take Profit</div><div class="val" style="color:var(--success)">${fmtPrice(p.takeProfit)}</div></div>
      <div class="stat"><div class="lbl">Stop Loss</div><div class="val" style="color:var(--danger)">${fmtPrice(p.stopLoss)}</div></div>
    </div>
    <ul class="reasons">${p.reasons.map(r => `<li>${r}</li>`).join("")}</ul>
    <div style="margin-top:14px;font-size:12px;color:var(--muted)">Risk : Reward = 1 : ${rr}</div>
  </div>`;
}

// ====== Page initialisers ======
function setStatus(ok, when) {
  const el = document.getElementById("status");
  if (!el) return;
  el.innerHTML = `<span class="dot ${ok ? "" : "off"}"></span> ${ok ? "Live feed" : "Feed offline"} ${when ? "· updated " + when.toLocaleTimeString() : ""}`;
}

async function initDashboard() {
  const grid = document.getElementById("pairs-grid");
  if (!grid) return;
  grid.innerHTML = BASE_PAIRS.map(pairCardHTML).join("");

  // Strength
  const sEl = document.getElementById("strength-list");
  if (sEl) sEl.innerHTML = STRENGTH.map(s => `
    <div class="str-row">
      <div class="hdr"><span class="mono" style="font-weight:700">${s.code}</span><span style="color:var(--muted)">${s.value}%</span></div>
      <div class="bar"><span style="width:${s.value}%"></span></div>
    </div>`).join("");

  // Calendar
  const cEl = document.getElementById("calendar-list");
  if (cEl) cEl.innerHTML = CALENDAR.map(c => `
    <div class="cal-row">
      <span class="time">${c.time}</span><span class="cur">${c.currency}</span>
      <span class="imp ${c.impact}">${c.impact}</span>
      <span style="color:var(--muted);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${c.event}</span>
    </div>`).join("");

  // Risk calculator
  const calc = () => {
    const bal = +document.getElementById("bal").value || 0;
    const rsk = +document.getElementById("rsk").value || 0;
    const pips = +document.getElementById("pips").value || 0;
    const amount = (bal * rsk) / 100;
    const lot = pips > 0 ? +(amount / (pips * 10)).toFixed(2) : 0;
    document.getElementById("riskAmt").textContent = "$" + amount.toFixed(2);
    document.getElementById("riskLot").textContent = lot;
  };
  ["bal", "rsk", "pips"].forEach(id => document.getElementById(id)?.addEventListener("input", calc));
  calc();

  const refresh = async () => {
    const pairs = await loadPairs();
    grid.innerHTML = pairs.map(pairCardHTML).join("");
    const anyLive = pairs.some(p => p.live);
    setStatus(anyLive, new Date());
  };
  await refresh();
  setInterval(refresh, 60000);
}

async function initSignals() {
  const wrap = document.getElementById("signals-list");
  if (!wrap) return;
  wrap.innerHTML = BASE_PAIRS.map(signalCardHTML).join("");
  const refresh = async () => {
    const pairs = await loadPairs();
    wrap.innerHTML = pairs.map(signalCardHTML).join("");
    setStatus(pairs.some(p => p.live), new Date());
  };
  await refresh();
  setInterval(refresh, 60000);
}

function initStrength() {
  const el = document.getElementById("strength-full");
  if (!el) return;
  el.innerHTML = STRENGTH.sort((a,b)=>b.value-a.value).map(s => `
    <div class="str-row">
      <div class="hdr"><span class="mono" style="font-weight:700;font-size:16px">${s.code}</span><span style="color:var(--muted)">${s.value}%</span></div>
      <div class="bar" style="height:10px"><span style="width:${s.value}%"></span></div>
    </div>`).join("");
}

function aiReply(q) {
  const t = q.toLowerCase();
  const p = BASE_PAIRS.find(p => t.includes(p.symbol.toLowerCase()) || t.includes(p.symbol.toLowerCase().replace("/","")));
  if (p) return `${p.symbol} — Trend: ${p.macd}\nRSI: ${p.rsi} · MACD: ${p.macd}\n\nRecommendation: ${p.signal}\nEntry: ${p.entry} · TP: ${p.takeProfit} · SL: ${p.stopLoss}\nConfidence: ${p.confidence}%\n\nReasons:\n- ${p.reasons.join("\n- ")}`;
  if (t.includes("risk") || t.includes("lot")) return "Use the Smart Risk Manager on the Dashboard. Enter balance, risk % and stop pips to get lot size.";
  if (t.includes("strength")) return "Check the Currency Strength page. USD leads at 82%, JPY is weakest at 39%.";
  return "I analyse 28 majors across RSI, MACD, EMA cross, market structure, S/R and sentiment. Ask about a specific pair, e.g. 'Should I buy EUR/USD?'";
}

function initAssistant() {
  const chat = document.getElementById("chat");
  const input = document.getElementById("chat-input");
  const send = document.getElementById("chat-send");
  if (!chat) return;
  const add = (text, who) => {
    const div = document.createElement("div");
    div.className = "msg " + who;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  };
  add("Hi! I'm your AI Forex assistant. Ask me about any pair, signal, or risk strategy.", "ai");
  const submit = () => {
    const v = input.value.trim();
    if (!v) return;
    add(v, "user");
    input.value = "";
    setTimeout(() => add(aiReply(v), "ai"), 250);
  };
  send.addEventListener("click", submit);
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
}

document.addEventListener("DOMContentLoaded", () => {
  initDashboard();
  initSignals();
  initStrength();
  initAssistant();
});