import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { STRENGTH } from "@/lib/forex-data";

export const Route = createFileRoute("/strength")({
  head: () => ({ meta: [{ title: "Currency Strength — KTM Tech Forex" }] }),
  component: Strength,
});

function Strength() {
  const sorted = [...STRENGTH].sort((a, b) => b.value - a.value);
  return (
    <AppShell title="Currency Strength Meter" subtitle="Relative strength across the 8 majors.">
      <div className="glass rounded-2xl p-6 md:p-8 max-w-3xl">
        <div className="space-y-5">
          {sorted.map((s, i) => (
            <div key={s.code}>
              <div className="flex justify-between items-baseline mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-5">#{i + 1}</span>
                  <span className="font-mono font-bold text-lg">{s.code}</span>
                </div>
                <span className="font-mono font-semibold">{s.value}%</span>
              </div>
              <div className="h-3 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${s.value}%`,
                    background: s.value > 65
                      ? `linear-gradient(90deg, var(--color-primary), var(--color-accent))`
                      : s.value > 45 ? `var(--color-warning)` : `var(--color-destructive)`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}