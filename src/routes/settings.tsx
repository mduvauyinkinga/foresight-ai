import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — KTM Tech Forex" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell title="Settings" subtitle="Customize your trading workspace.">
      <div className="max-w-2xl space-y-6">
        <Card title="Profile">
          <Input label="Display name" defaultValue="Trader" />
          <Input label="Email" defaultValue="you@ktmtech.app" type="email" />
        </Card>
        <Card title="Trading Defaults">
          <Input label="Default account balance ($)" defaultValue="1000" type="number" />
          <Input label="Default risk per trade (%)" defaultValue="2" type="number" />
        </Card>
        <Card title="Notifications">
          <Toggle label="Signal alerts" defaultChecked />
          <Toggle label="High-impact news alerts" defaultChecked />
          <Toggle label="Weekly performance digest" />
        </Card>
      </div>
    </AppShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-6">
      <h3 className="font-semibold mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
function Input(props: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const { label, ...rest } = props;
  return (
    <label className="block text-sm">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input {...rest} className="mt-1 w-full bg-input border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50" />
    </label>
  );
}
function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  return (
    <label className="flex items-center justify-between text-sm">
      <span>{label}</span>
      <input type="checkbox" defaultChecked={defaultChecked} className="h-5 w-9 appearance-none rounded-full bg-secondary checked:bg-primary transition cursor-pointer relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:h-4 after:w-4 after:rounded-full after:bg-foreground after:transition checked:after:translate-x-4" />
    </label>
  );
}