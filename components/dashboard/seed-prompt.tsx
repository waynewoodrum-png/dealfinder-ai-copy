"use client"

import { useTransition } from "react"
import { Sparkles } from "lucide-react"
import { seedDeals } from "@/app/actions/deals"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function SeedPrompt() {
  const [isPending, startTransition] = useTransition()

  return (
    <Card className="border-dashed border-border bg-card p-8 text-center">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </span>
      <h2 className="mt-4 text-lg font-semibold text-foreground">Let&apos;s find your first deals</h2>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Load a set of sample deals to see how DealFinder tracks your savings, or add your own using the button above.
      </p>
      <Button
        disabled={isPending}
        onClick={() => startTransition(() => seedDeals())}
        className="mt-6 min-h-11"
      >
        {isPending ? "Finding deals..." : "Load sample deals"}
      </Button>
    </Card>
  )
}
