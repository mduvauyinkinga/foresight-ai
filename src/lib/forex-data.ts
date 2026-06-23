export type Signal = "BUY" | "SELL" | "HOLD";

export interface Pair {
  symbol: string;
  name: string;
  price: number;
  change: number;
  signal: Signal;
  confidence: number;
  risk: "Low" | "Medium" | "High";
  rsi: number;
  macd: "Bullish" | "Bearish" | "Neutral";
  entry: number;
  takeProfit: number;
  stopLoss: number;
  reasons: string[];
}

export const PAIRS: Pair[] = [
  {
    symbol: "EUR/USD", name: "Euro / US Dollar",
    price: 1.0921, change: 0.34, signal: "BUY", confidence: 87, risk: "Low",
    rsi: 61, macd: "Bullish",
    entry: 1.0910, takeProfit: 1.0965, stopLoss: 1.0880,
    reasons: ["Bullish MACD crossover", "RSI recovering from oversold", "USD weakness on CPI miss", "Higher-low market structure"],
  },
  {
    symbol: "GBP/USD", name: "British Pound / US Dollar",
    price: 1.2734, change: -0.21, signal: "SELL", confidence: 79, risk: "Medium",
    rsi: 38, macd: "Bearish",
    entry: 1.2740, takeProfit: 1.2680, stopLoss: 1.2770,
    reasons: ["Bearish MACD", "Rejected at 1.2760 resistance", "Negative UK retail sentiment"],
  },
  {
    symbol: "USD/JPY", name: "US Dollar / Japanese Yen",
    price: 154.82, change: 0.12, signal: "HOLD", confidence: 54, risk: "High",
    rsi: 52, macd: "Neutral",
    entry: 154.80, takeProfit: 155.40, stopLoss: 154.20,
    reasons: ["Range-bound between 154.20–155.40", "BoJ intervention risk", "Mixed momentum"],
  },
  {
    symbol: "XAU/USD", name: "Gold Spot",
    price: 2348.50, change: 1.08, signal: "BUY", confidence: 92, risk: "Low",
    rsi: 64, macd: "Bullish",
    entry: 2346.0, takeProfit: 2378.0, stopLoss: 2330.0,
    reasons: ["Safe-haven demand rising", "USD index breakdown", "Bullish EMA 20/50 cross", "Strong volume confirmation"],
  },
  {
    symbol: "BTC/USD", name: "Bitcoin / US Dollar",
    price: 67_842, change: 2.41, signal: "BUY", confidence: 81, risk: "High",
    rsi: 68, macd: "Bullish",
    entry: 67_500, takeProfit: 71_000, stopLoss: 65_800,
    reasons: ["Breakout above 67k", "ETF inflows accelerating", "Momentum aligned"],
  },
];

export const STRENGTH: { code: string; value: number }[] = [
  { code: "USD", value: 82 },
  { code: "EUR", value: 71 },
  { code: "GBP", value: 67 },
  { code: "JPY", value: 39 },
  { code: "AUD", value: 58 },
  { code: "CHF", value: 63 },
  { code: "CAD", value: 55 },
  { code: "NZD", value: 47 },
];

export const CALENDAR = [
  { time: "08:30", currency: "USD", impact: "High", event: "Non-Farm Payrolls" },
  { time: "10:00", currency: "EUR", impact: "Medium", event: "ECB President Speech" },
  { time: "14:00", currency: "USD", impact: "High", event: "FOMC Rate Decision" },
  { time: "23:50", currency: "JPY", impact: "Medium", event: "BoJ Core CPI" },
  { time: "06:00", currency: "GBP", impact: "High", event: "UK CPI y/y" },
];

export function aiReply(question: string): string {
  const q = question.toLowerCase();
  const pair = PAIRS.find((p) => q.includes(p.symbol.toLowerCase().replace("/", "")) || q.includes(p.symbol.toLowerCase()));
  if (pair) {
    return `**${pair.symbol}** is currently ${pair.macd === "Bullish" ? "bullish" : pair.macd === "Bearish" ? "bearish" : "neutral"}.

- Trend: ${pair.macd}
- RSI: ${pair.rsi}
- MACD: ${pair.macd} ${pair.macd !== "Neutral" ? "crossover" : ""}

**Recommendation: ${pair.signal}**

- Entry: ${pair.entry}
- Take Profit: ${pair.takeProfit}
- Stop Loss: ${pair.stopLoss}
- Confidence: ${pair.confidence}%

Reasons:
${pair.reasons.map((r) => `- ${r}`).join("\n")}`;
  }
  if (q.includes("risk") || q.includes("lot")) {
    return "Use the **Smart Risk Manager** on the Dashboard. Enter your account balance and risk %, and I'll compute lot size and stop-loss pips for you.";
  }
  if (q.includes("strength")) {
    return "Check the **Currency Strength Meter** on the Dashboard. USD is currently dominant at 82%, JPY is weakest at 39%.";
  }
  return "I analyze 28 major pairs across 6 indicators (RSI, MACD, EMA cross, structure, S/R, sentiment). Ask me about any pair, e.g. *\"Should I buy EUR/USD?\"*";
}

export function calcRisk(balance: number, riskPct: number, stopPips: number) {
  const riskAmount = (balance * riskPct) / 100;
  const pipValue = 10; // standard lot
  const lotSize = stopPips > 0 ? +(riskAmount / (stopPips * pipValue)).toFixed(2) : 0;
  return { riskAmount: +riskAmount.toFixed(2), lotSize };
}