import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { PAIRS, STRENGTH, CALENDAR, calcRisk } from "@/lib/forex-data";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — KTM Tech Forex" }, { name: "description", content: "Live AI forex dashboard." }] }),
  component: Dashboard,
});

function Dashboard() {
  const [balance, setBalance] = useState(1000);
  const [risk, setRisk] = useState(2);
  const [pips, setPips] = useState(50);
  const calc = useMemo(() => calcRisk(balance, risk, pips), [balance, risk, pips]);

  return (
    <AppShell title="Dashboard" subtitle="Live AI verdicts across major pairs.">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PAIRS.map((p) => (
          <div key={p.symbol} className="glass rounded-xl p-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono font-bold text-lg">{p.symbol}</div>
                <div className="text-xs text-muted-foreground">{p.name}</div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                p.signal === "BUY" ? "bg-success/20 text-success" :
                p.signal === "SELL" ? "bg-destructive/20 text-destructive" :
                "bg-muted text-muted-foreground"
              }`}>{p.signal}</span>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <span className="text-2xl font-bold font-mono">{p.price.toLocaleString()}</span>
              <span className={`font-mono text-sm ${p.change >= 0 ? "text-success" : "text-destructive"}`}>
                {p.change >= 0 ? "+" : ""}{p.change}%
              </span>
            </div>
            <div className="mt-4 space-y-2 text-xs">
              <div className="flex justify-between"><span className="text-muted-foreground">Confidence</span><span className="font-semibold">{p.confidence}%</span></div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${p.confidence}%` }} />
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-muted-foreground">Risk</span>
                <span className={`font-semibold ${
                  p.risk === "Low" ? "text-success" : p.risk === "High" ? "text-destructive" : "text-warning"
                }`}>{p.risk}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-4">
        <div className="glass rounded-2xl p-6 lg:col-span-1">
          <h3 className="font-semibold mb-4">Currency Strength</h3>
          <div className="space-y-3">
            {STRENGTH.map((s) => (
              <div key={s.code}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-mono font-semibold">{s.code}</span>
                  <span className="text-muted-foreground">{s.value}%</span>
                </div>
                <div className="h-2 rounded-full bg-secondary overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${s.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-1">
          <h3 className="font-semibold">Smart Risk Manager</h3>
          <p className="text-xs text-muted-foreground mt-1">Auto-calculate position size.</p>
          <div className="mt-5 space-y-4 text-sm">
            <Field label="Account Balance ($)" value={balance} onChange={setBalance} />
            <Field label="Risk (%)" value={risk} onChange={setRisk} step={0.5} />
            <Field label="Stop Loss (pips)" value={pips} onChange={setPips} />
          </div>
          <div className="mt-6 p-4 rounded-xl bg-background/50 space-y-2 text-sm">
            <Row label="Risk Amount" value={`$${calc.riskAmount}`} />
            <Row label="Suggested Lot Size" value={calc.lotSize} highlight />
            <Row label="Stop Loss" value={`${pips} pips`} />
          </div>
        </div>

        <div className="glass rounded-2xl p-6 lg:col-span-1">
          <h3 className="font-semibold mb-4">Economic Calendar</h3>
          <div className="space-y-3">
            {CALENDAR.map((e) => (
              <div key={e.event} className="flex items-center gap-3 text-sm">
                <span className="font-mono text-xs text-muted-foreground w-12">{e.time}</span>
                <span className="font-semibold w-10">{e.currency}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                  e.impact === "High" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
                }`}>{e.impact}</span>
                <span className="text-muted-foreground truncate">{e.event}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Field({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (n: number) => void; step?: number }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input
        type="number"
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
      />
    </label>
  );
}

function Row({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-mono font-semibold ${highlight ? "text-primary text-base" : ""}`}>{value}</span>
    </div>
  );
}