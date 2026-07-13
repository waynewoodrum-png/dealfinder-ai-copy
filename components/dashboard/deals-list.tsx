"use client"

import { useMemo, useState, useTransition } from "react"
import { Check, Trash2, RotateCcw, ShoppingBag, Search, X, SlidersHorizontal } from "lucide-react"
import { updateDealStatus, deleteDeal } from "@/app/actions/deals"
import { recordAffiliateClick } from "@/app/actions/affiliate"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { type DealView, formatCurrency } from "@/lib/deal-stats"

type SortKey = "discount" | "savings" | "price" | "newest"

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "discount", label: "Biggest discount" },
  { value: "savings", label: "Biggest savings" },
  { value: "price", label: "Lowest price" },
  { value: "newest", label: "Newest" },
]

function sortLabel(value: string): string {
  return SORT_OPTIONS.find((o) => o.value === value)?.label ?? "Sort"
}

function sortDeals(deals: DealView[], sort: SortKey): DealView[] {
  const copy = [...deals]
  switch (sort) {
    case "discount":
      return copy.sort((a, b) => b.discountPct - a.discountPct)
    case "savings":
      return copy.sort((a, b) => b.savings - a.savings)
    case "price":
      return copy.sort((a, b) => a.dealPrice - b.dealPrice)
    case "newest":
      return copy.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  }
}

export function DealsList({
  deals,
  affiliateEnabled = true,
}: {
  deals: DealView[]
  affiliateEnabled?: boolean
}) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [sort, setSort] = useState<SortKey>("discount")

  const categories = useMemo(() => {
    const set = new Set(deals.map((d) => d.category))
    return ["All", ...Array.from(set).sort()]
  }, [deals])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    const matches = deals.filter((d) => {
      const inCategory = category === "All" || d.category === category
      if (!inCategory) return false
      if (!q) return true
      return (
        d.title.toLowerCase().includes(q) ||
        d.merchant.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      )
    })
    return sortDeals(matches, sort)
  }, [deals, query, category, sort])

  const active = filtered.filter((d) => d.status === "active")
  const claimed = filtered.filter((d) => d.status === "claimed")
  const isFiltering = query.trim() !== "" || category !== "All"
  const totalMatches = filtered.length

  return (
    <div className="flex flex-col gap-6">
      {/* Search + filter toolbar */}
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals by product, merchant, or category"
            aria-label="Search deals"
            className="h-11 pl-9 pr-9 text-base"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
            {categories.map((c) => {
              const selected = c === category
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  aria-pressed={selected}
                  className={`min-h-9 rounded-full border px-3 text-sm font-medium transition-colors ${
                    selected
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="h-9 w-[180px] text-sm" aria-label="Sort deals">
                <SelectValue>{(value) => sortLabel(value as string)}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFiltering && (
          <p className="text-xs text-muted-foreground" aria-live="polite">
            {totalMatches === 0
              ? "No deals match your search."
              : `${totalMatches} ${totalMatches === 1 ? "deal" : "deals"} found`}
            {category !== "All" ? ` in ${category}` : ""}
            {query.trim() ? ` for “${query.trim()}”` : ""}
          </p>
        )}
      </div>

      {isFiltering && totalMatches === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-border p-8 text-center">
          <Search className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          <p className="text-sm text-muted-foreground text-pretty">
            No deals match your filters. Try a different search or category.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="bg-transparent"
            onClick={() => {
              setQuery("")
              setCategory("All")
            }}
          >
            Clear filters
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <DealGroup
            title="Active price drops"
            description="Deals the AI found that are ready to claim"
            deals={active}
            emptyLabel="No active deals right now. Track an item and we'll watch its price."
            affiliateEnabled={affiliateEnabled}
          />
          <DealGroup
            title="Claimed savings"
            description="Deals you've already locked in"
            deals={claimed}
            emptyLabel="Claim an active deal to start building your savings."
            affiliateEnabled={affiliateEnabled}
          />
        </div>
      )}
    </div>
  )
}

function DealGroup({
  title,
  description,
  deals,
  emptyLabel,
  affiliateEnabled,
}: {
  title: string
  description: string
  deals: DealView[]
  emptyLabel: string
  affiliateEnabled: boolean
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
            <DealCard key={deal.id} deal={deal} affiliateEnabled={affiliateEnabled} />
          ))}
        </ul>
      )}
    </section>
  )
}

function DealCard({ deal, affiliateEnabled }: { deal: DealView; affiliateEnabled: boolean }) {
  const [isPending, startTransition] = useTransition()
  const isClaimed = deal.status === "claimed"

  function handleShop() {
    // Open a placeholder synchronously so the browser doesn't block the popup,
    // then redirect it to the tracked affiliate URL once recorded.
    const win = window.open("", "_blank", "noopener,noreferrer")
    startTransition(async () => {
      try {
        const { url } = await recordAffiliateClick({
          source: "deal",
          label: deal.title,
          merchant: deal.merchant,
          query: deal.title,
          price: deal.dealPrice,
        })
        if (win) win.location.href = url
        else window.open(url, "_blank", "noopener,noreferrer")
      } catch {
        if (win) win.close()
      }
    })
  }

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
          {affiliateEnabled && (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={handleShop}
              className="min-h-10 bg-transparent"
            >
              <ShoppingBag className="h-4 w-4" aria-hidden="true" />
              Shop
            </Button>
          )}
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
