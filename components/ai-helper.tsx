"use client"

import { FormEvent, useMemo, useRef, useState } from "react"
import { Bot, Loader2, Send, Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ChatMessage = {
  role: "user" | "assistant"
  content: string
}

const starterPrompts = [
  "Find me deals at Walmart",
  "Compare Best Buy electronics deals",
  "What should I track for a price drop?",
]

export function AiHelper() {
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hi, I’m your DealFinder helper. Ask me what to buy, where to compare prices, or which deals to track.",
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  const canSend = useMemo(() => input.trim().length > 0 && !isLoading, [input, isLoading])

  async function sendMessage(messageText: string) {
    const text = messageText.trim()
    if (!text || isLoading) return

    const nextMessages: ChatMessage[] = [...messages, { role: "user", content: text }]
    setMessages([...nextMessages, { role: "assistant", content: "" }])
    setInput("")
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
        signal: controller.signal,
      })

      if (!response.ok || !response.body) {
        throw new Error("The helper could not respond right now.")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        assistantText += decoder.decode(value, { stream: true })
        setMessages([...nextMessages, { role: "assistant", content: assistantText }])
      }
    } catch (error) {
      if ((error as Error).name !== "AbortError") {
        setMessages([...nextMessages, { role: "assistant", content: "I couldn’t reach the AI helper. Please try again." }])
      }
    } finally {
      setIsLoading(false)
      abortRef.current = null
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage(input)
  }

  return (
    <div className="fixed right-4 bottom-4 z-50 sm:right-6 sm:bottom-6">
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">DealFinder AI helper</p>
                <p className="text-xs text-muted-foreground">Shopping and savings assistant</p>
              </div>
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              aria-label="Close AI helper"
              onClick={() => {
                abortRef.current?.abort()
                setIsOpen(false)
              }}
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={cn(
                  "rounded-2xl px-3 py-2 text-sm leading-relaxed",
                  message.role === "user"
                    ? "ml-8 bg-primary text-primary-foreground"
                    : "mr-8 bg-muted text-foreground",
                )}
              >
                {message.content || (
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    Thinking
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="border-t border-border px-4 py-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {starterPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  onClick={() => void sendMessage(prompt)}
                  disabled={isLoading}
                >
                  {prompt}
                </button>
              ))}
            </div>
            <form onSubmit={onSubmit} className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask about deals..."
                className="min-h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              <Button type="submit" size="icon-lg" aria-label="Send message" disabled={!canSend}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </div>
        </div>
      )}

      <Button size="lg" className="h-12 rounded-full px-5 shadow-lg" onClick={() => setIsOpen((value) => !value)}>
        <Sparkles className="h-4 w-4" aria-hidden="true" />
        AI helper
      </Button>
    </div>
  )
}
