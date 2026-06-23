import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/AppShell";
import { aiReply } from "@/lib/forex-data";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Assistant — KTM Tech Forex" }] }),
  component: Assistant,
});

interface Msg { role: "user" | "ai"; text: string }

const SUGGESTIONS = ["Should I buy EUR/USD?", "Analyze XAU/USD", "What's the strongest currency?", "How do I size my risk?"];

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "ai", text: "Hi — I'm your KTM Tech AI analyst. Ask me about any pair, e.g. *Should I buy EUR/USD?*" },
  ]);
  const [input, setInput] = useState("");

  function send(text: string) {
    if (!text.trim()) return;
    const reply = aiReply(text);
    setMessages((m) => [...m, { role: "user", text }, { role: "ai", text: reply }]);
    setInput("");
  }

  return (
    <AppShell title="AI Forex Assistant" subtitle="Ask anything — get trend, levels, and a verdict.">
      <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-12rem)]">
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-3 ${m.role === "user" ? "justify-end" : ""}`}>
              {m.role === "ai" && (
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent grid place-items-center shrink-0">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div className={`rounded-2xl px-4 py-3 max-w-[80%] text-sm whitespace-pre-wrap ${
                m.role === "user" ? "bg-primary text-primary-foreground" : "glass"
              }`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <div className="flex flex-wrap gap-2 mb-3">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs glass px-3 py-1.5 rounded-full hover:bg-secondary">
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex gap-2 glass rounded-2xl p-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about any pair…"
              className="flex-1 bg-transparent px-3 py-2 focus:outline-none text-sm"
            />
            <button type="submit" className="bg-primary text-primary-foreground rounded-xl px-4 py-2 flex items-center gap-2 text-sm font-medium hover:opacity-90">
              <Send className="h-4 w-4" /> Send
            </button>
          </form>
        </div>
      </div>
    </AppShell>
  );
}