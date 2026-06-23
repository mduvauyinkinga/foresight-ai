import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { TrendingUp, Brain, Shield, Activity, Calendar, Gauge, ArrowRight, CheckCircle2 } from "lucide-react";
import { PAIRS, STRENGTH, CALENDAR } from "@/lib/forex-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KTM Tech Forex Analysis — AI-Powered Trade Signals" },
      { name: "description", content: "Get AI-powered forex trade analysis in seconds. Buy/sell signals, currency strength meter, risk management, and an AI assistant." },
      { property: "og:title", content: "KTM Tech Forex Analysis" },
      { property: "og:description", content: "AI-Powered Forex Market Analysis & Trade Signals." },
    ],
  }),
  component: Index,
});

const FEATURES = [
  { icon: TrendingUp, title: "Buy / Sell Signals", desc: "Real-time signals across 28 major pairs with entry, SL & TP." },
  { icon: Brain, title: "AI Market Insights", desc: "Consensus engine combining RSI, MACD, EMA & sentiment." },
  { icon: Gauge, title: "Currency Strength Meter", desc: "See which currencies are strong or weak at a glance." },
  { icon: Shield, title: "Smart Risk Manager", desc: "Auto-calculated lot sizing based on your account & risk." },
  { icon: Activity, title: "Trend Analysis", desc: "Multi-timeframe trend detection with confidence scoring." },
  { icon: Calendar, title: "Economic Calendar", desc: "Track FOMC, NFP, CPI & rate decisions that move markets." },
];

function Index() {
  return (
    <div className="min-h-screen">
      <header className="px-6 md:px-10 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-accent grid place-items-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-bold">KTM Tech</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Forex Analysis</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground">Features</a>
          <a href="#live" className="hover:text-foreground">Live Markets</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
        </nav>
        <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90">
          Launch App <ArrowRight className="h-4 w-4" />
        </Link>
      </header>

      {/* HERO */}
      <section className="px-6 md:px-10 pt-16 md:pt-24 pb-20 max-w-6xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs">
          <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
          <span className="text-muted-foreground">AI Trading Consensus Engine — Live</span>
        </div>
        <h1 className="mt-6 text-4xl md:text-7xl font-extrabold leading-[1.05]">
          Get <span className="text-gradient">AI-Powered</span><br />
          Forex Trade Analysis<br />
          in Seconds.
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl">
          KTM Tech combines six market indicators into one clear verdict — with confidence, risk, and reasoning. No more blind signals.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-semibold hover:opacity-90">
            Open Dashboard <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/assistant" className="inline-flex items-center gap-2 glass px-6 py-3.5 rounded-lg font-semibold hover:bg-secondary">
            Try AI Assistant
          </Link>
        </div>

        {/* Hero verdict card */}
        <div className="mt-14 grid md:grid-cols-5 gap-4">
          <div className="md:col-span-3 glass rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-muted-foreground uppercase tracking-wider">AI Verdict · XAU/USD</div>
                <div className="mt-2 flex items-baseline gap-3">
                  <span className="text-5xl font-extrabold text-success">BUY</span>
                  <span className="text-sm text-muted-foreground">Confidence 92%</span>
                </div>
              </div>
              <div className="text-right font-mono">
                <div className="text-2xl font-bold">$2,348.50</div>
                <div className="text-success text-sm">+1.08%</div>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
              <div className="rounded-lg bg-background/50 p-3"><div className="text-xs text-muted-foreground">Entry</div><div className="font-mono font-semibold">2346.0</div></div>
              <div className="rounded-lg bg-background/50 p-3"><div className="text-xs text-muted-foreground">Take Profit</div><div className="font-mono font-semibold text-success">2378.0</div></div>
              <div className="rounded-lg bg-background/50 p-3"><div className="text-xs text-muted-foreground">Stop Loss</div><div className="font-mono font-semibold text-destructive">2330.0</div></div>
            </div>
            <ul className="mt-5 space-y-2 text-sm">
              {["Bullish MACD crossover", "USD index breakdown", "Strong volume confirmation", "EMA 20/50 bull cross"].map((r) => (
                <li key={r} className="flex items-center gap-2 text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success" />{r}</li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-2 glass rounded-2xl p-6">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-4">Currency Strength</div>
            <div className="space-y-3">
              {STRENGTH.slice(0, 6).map((s) => (
                <div key={s.code}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-mono font-semibold">{s.code}</span>
                    <span className="text-muted-foreground">{s.value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${s.value}%`,
                        background: `linear-gradient(90deg, var(--color-primary), var(--color-accent))`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="px-6 md:px-10 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold">Everything you need to trade smarter.</h2>
        <p className="mt-3 text-muted-foreground max-w-2xl">Indicators, signals, risk and AI — unified in one clean workspace.</p>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="glass rounded-2xl p-6 hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/15 text-primary grid place-items-center">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-lg">{f.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* LIVE */}
      <section id="live" className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Top Currency Pairs</h2>
          <Link to="/dashboard" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAIRS.slice(0, 6).map((p) => (
            <div key={p.symbol} className="glass rounded-xl p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-mono font-bold">{p.symbol}</div>
                  <div className="text-xs text-muted-foreground">{p.name}</div>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-md ${
                  p.signal === "BUY" ? "bg-success/20 text-success" :
                  p.signal === "SELL" ? "bg-destructive/20 text-destructive" :
                  "bg-muted text-muted-foreground"
                }`}>{p.signal}</span>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono">{p.price.toLocaleString()}</span>
                <span className={`text-sm font-mono ${p.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {p.change >= 0 ? "+" : ""}{p.change}%
                </span>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${p.confidence}%` }} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">Confidence {p.confidence}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* CALENDAR */}
      <section className="px-6 md:px-10 py-16 max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Today's Economic Calendar</h2>
        <div className="glass rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 px-5 py-3 text-xs uppercase tracking-wider text-muted-foreground border-b border-border">
            <div className="col-span-2">Time</div>
            <div className="col-span-2">Currency</div>
            <div className="col-span-2">Impact</div>
            <div className="col-span-6">Event</div>
          </div>
          {CALENDAR.map((e) => (
            <div key={e.event} className="grid grid-cols-12 px-5 py-4 text-sm border-b border-border last:border-0 hover:bg-secondary/40">
              <div className="col-span-2 font-mono">{e.time}</div>
              <div className="col-span-2 font-semibold">{e.currency}</div>
              <div className="col-span-2">
                <span className={`text-xs px-2 py-1 rounded ${
                  e.impact === "High" ? "bg-destructive/20 text-destructive" : "bg-warning/20 text-warning"
                }`}>{e.impact}</span>
              </div>
              <div className="col-span-6 text-muted-foreground">{e.event}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="px-6 md:px-10 py-20 max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center">Simple pricing.</h2>
        <div className="mt-10 grid md:grid-cols-3 gap-4">
          {[
            { name: "Free", price: "$0", features: ["5 signals / day", "Basic AI Assistant", "Currency Strength Meter"] },
            { name: "Pro", price: "$29", highlight: true, features: ["Unlimited signals", "Economic Calendar", "Advanced AI Analysis", "Trade Journal"] },
            { name: "Premium", price: "$79", features: ["Everything in Pro", "Screenshot Analyzer", "AI Backtesting", "Portfolio Tracking"] },
          ].map((t) => (
            <div key={t.name} className={`glass rounded-2xl p-6 ${t.highlight ? "border-primary/60 ring-1 ring-primary/40" : ""}`}>
              <div className="text-sm uppercase tracking-wider text-muted-foreground">{t.name}</div>
              <div className="mt-2 text-4xl font-extrabold">{t.price}<span className="text-base font-normal text-muted-foreground">/mo</span></div>
              <ul className="mt-6 space-y-2 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" />{f}</li>
                ))}
              </ul>
              <Link to="/dashboard" className={`mt-6 inline-flex w-full justify-center py-2.5 rounded-lg font-medium ${
                t.highlight ? "bg-primary text-primary-foreground" : "glass hover:bg-secondary"
              }`}>Get started</Link>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 md:px-10 py-10 border-t border-border text-sm text-muted-foreground text-center">
        © 2026 KTM Tech Forex Analysis. Trading involves risk. Not financial advice.
      </footer>
    </div>
  );
}
