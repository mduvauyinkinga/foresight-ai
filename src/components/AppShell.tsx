import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Radio, Activity, Sparkles, Settings, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/signals", label: "Signals", icon: Radio },
  { to: "/strength", label: "Currency Strength", icon: Activity },
  { to: "/assistant", label: "AI Assistant", icon: Sparkles },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children, title, subtitle }: { children: ReactNode; title: string; subtitle?: string }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <div className="min-h-screen flex">
      <aside className="hidden md:flex w-64 flex-col border-r border-border bg-card/40 backdrop-blur">
        <Link to="/" className="flex items-center gap-2 px-6 py-5 border-b border-border">
          <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="leading-tight">
            <div className="font-bold text-sm">KTM Tech</div>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Forex Analysis</div>
          </div>
        </Link>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((n) => {
            const Icon = n.icon;
            const active = pathname === n.to;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                }`}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 m-3 rounded-xl glass">
          <div className="text-xs text-muted-foreground">Plan</div>
          <div className="font-semibold">Free</div>
          <div className="text-xs text-muted-foreground mt-1">5 signals / day</div>
          <button className="mt-3 w-full text-xs font-medium bg-primary text-primary-foreground rounded-md py-2 hover:opacity-90">
            Upgrade to Pro
          </button>
        </div>
      </aside>
      <main className="flex-1 min-w-0">
        <header className="px-6 md:px-10 py-6 border-b border-border flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span className="text-muted-foreground">Markets Open · London</span>
          </div>
        </header>
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}