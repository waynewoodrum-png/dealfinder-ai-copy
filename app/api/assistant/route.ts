import { streamText } from "ai"

export const maxDuration = 30

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

function cleanMessages(messages: unknown): ChatMessage[] {
  if (!Array.isArray(messages)) return []

  return messages
    .filter(
      (message): message is ChatMessage =>
        typeof message === "object" &&
        message !== null &&
        ((message as ChatMessage).role === "user" || (message as ChatMessage).role === "assistant") &&
        typeof (message as ChatMessage).content === "string" &&
        (message as ChatMessage).content.trim().length > 0,
    )
    .slice(-8)
    .map((message) => ({ role: message.role, content: message.content.slice(0, 1200) }))
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({ messages: [] }))
  const safeMessages = cleanMessages(body.messages)

  if (!process.env.AI_GATEWAY_API_KEY) {
    return new Response(
      "I can help shoppers find restaurants under budget, compare deals, pick stores, and explain savings. Add AI_GATEWAY_API_KEY in Vercel Environment Variables to enable live AI responses.",
      { headers: { "Content-Type": "text/plain; charset=utf-8" } },
    )
  }

  const response = streamText({
    model: process.env.AI_HELPER_MODEL ?? "openai/gpt-5-mini",
    system:
      "You are DealFinder AI's savings helper. Be concise, practical, and focused on helping users find restaurants under a budget, compare retailers, understand affiliate/sponsored placements, and decide what to track for price drops. When asked for restaurants, ask for location if missing and suggest budget-friendly ordering strategies. Do not claim that a store or restaurant sponsors the app unless the user says an approved partnership exists.",
    messages: safeMessages,
  })

  return response.toTextStreamResponse({
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
    },
  })
}
