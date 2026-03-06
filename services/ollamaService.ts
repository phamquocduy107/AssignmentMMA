import { Handbag } from "@/types/handbag";
import { fetchHandbags } from "./api";

const OLLAMA_HOST =
  process.env.EXPO_PUBLIC_OLLAMA_HOST ?? "http://165.22.249.132:11434";
const OLLAMA_MODEL = process.env.EXPO_PUBLIC_OLLAMA_MODEL ?? "qwen2.5:1.5b";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

function buildSystemPrompt(handbags: Handbag[]): string {
  const catalogText = handbags
    .map(
      (h) =>
        `- ID:${h.id} | "${h.handbagName}" | Brand: ${h.brand} | Category: ${h.category} | Price: $${h.cost} (${Math.round(h.percentOff * 100)}% OFF → $${(h.cost * (1 - h.percentOff)).toFixed(2)}) | Colors: ${h.color.join(", ")} | Gender: ${h.gender ? "Male" : "Female"}`,
    )
    .join("\n");

  return `You are an expert luxury handbag stylist assistant. You help customers find the perfect handbag based on their needs, preferences, and budget.

Here is the current handbag catalog you have access to:
${catalogText}

Guidelines:
- Answer in the same language the user uses (Vietnamese or English).
- Be friendly, helpful, and concise.
- When recommending bags, mention the name, brand, discounted price, and why it fits.
- If asked for recommendations, suggest 1-3 bags from the catalog above.
- Keep responses short and focused (2-4 sentences max unless listing items).
- Do not make up bags that are not in the catalog.`;
}

export async function sendMessage(
  history: Message[],
  userText: string,
): Promise<string> {
  // Build handbag catalog context
  const handbags = await fetchHandbags();
  const systemPrompt = buildSystemPrompt(handbags);

  const messages = [
    { role: "system", content: systemPrompt },
    ...history.map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userText },
  ];

  const response = await fetch(`${OLLAMA_HOST}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: OLLAMA_MODEL,
      messages,
      stream: false,
    }),
  });

  if (!response.ok) {
    throw new Error(`Ollama error: ${response.status}`);
  }

  const data = await response.json();
  return data.message?.content ?? "Sorry, I could not generate a response.";
}
