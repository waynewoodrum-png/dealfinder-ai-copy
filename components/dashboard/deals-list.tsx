"use client"

import { useTransition } from "react"
import { Check, Trash2, RotateCcw } from "lucide-react"
import { updateDealStatus, deleteDeal } from "@/app/actions/deals"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type DealView, formatCurrency } from "@/lib/deal-stats"

export function DealsList({ deals }: { deals: DealView[] }) {
  const active = deals.filter((d) => d.status === "active")
  const claimed = deals.filter((d) => d.status === "claimed")

  return (
    <div className="flex flex-col gap-8">
      <DealGroup
        title="Active price drops"
        description="Deals the AI found that are ready to claim"
        deals={active}
        emptyLabel="No active deals right now. Track an item and we'll watch its price."
      />
      <DealGroup
        title="Claimed savings"
        description="Deals you've already locked in"
        deals={claimed}
        emptyLabel="Claim an active deal to start building your savings."
      />
    </div>
  )
}

function DealGroup({
  title,
  description,
  deals,
  emptyLabel,
}: {
  title: string
  description: string
  deals: DealView[]
  emptyLabel: string
}) {
  return (
    <section aria-label={title}>
      <div className="flex items-baseline justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <span className="font-mono text-xs text-muted-foreground">{deals.length}</span>
      </div>

      {deals.length === 0 ? (
        <p className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-3">
          {deals.map((deal) => (
            <DealCard key={deal.id} deal={deal} />
          ))}
        </ul>
      )}
    </section>
  )
}

function DealCard({ deal }: { deal: DealView }) {
  const [isPending, startTransition] = useTransition()
  const isClaimed = deal.status === "claimed"

  return (
    <li>
      <Card className="flex flex-col gap-4 border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-medium text-foreground">{deal.title}</p>
            <Badge variant="secondary" className="shrink-0 bg-accent text-accent-foreground">
              -{deal.discountPct}%
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {deal.merchant} · {deal.category}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="font-mono text-lg font-semibold text-foreground">{formatCurrency(deal.dealPrice)}</span>
            <span className="font-mono text-sm text-muted-foreground line-through">
              {formatCurrency(deal.originalPrice)}
            </span>
            <span className="font-mono text-sm font-medium text-primary">save {formatCurrency(deal.savings)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {isClaimed ? (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => startTransition(() => updateDealStatus(deal.id, "active"))}
              className="min-h-10 bg-transparent"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Unclaim
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => startTransition(() => updateDealStatus(deal.id, "claimed"))}
              className="min-h-10"
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              Claim
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            disabled={isPending}
            onClick={() => startTransition(() => deleteDeal(deal.id))}
            className="min-h-10 min-w-10 text-muted-foreground hover:text-destructive"
            aria-label={`Delete ${deal.title}`}
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </Card>
    </li>
  )
}
