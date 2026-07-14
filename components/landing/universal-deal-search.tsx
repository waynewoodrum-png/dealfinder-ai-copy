"use client"

import { useMemo, useState } from "react"
import { ExternalLink, Layers3, Search, ShoppingBasket } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  buildUniversalSearchUrl,
  sampleUniversalResults,
  sourcesByCategory,
  type DealSourceCategory,
} from "@/lib/universal-deal-sources"

const categories: Array<DealSourceCategory | "all"> = ["all", "grocery", "electronics", "apparel", "home", "delivery"]

export function UniversalDealSearch() {
  const [query, setQuery] = useState("chicken breast family pack")
  const [category, setCategory] = useState<DealSourceCategory | "all">("all")
  const sources = useMemo(() => sourcesByCategory(category).slice(0, 8), [category])

  return (
    <section id="universal-deal-search" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Layers3 className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Universal deal search
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Search Walmart, Publix, Kroger, Best Buy, Nike, Home Depot, and more from one AI app
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Every store has its own app, coupons, loyalty rules, BOGO offers, and rollbacks. DealFinder’s advantage is
              acting like the AI layer across all of them so users can ask one question and compare sources.
            </p>

            <div className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <label className="text-sm font-medium text-foreground">
                Search item or deal rule
                <div className="mt-2 flex gap-2">
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-h-11 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    placeholder="brand TV, shoes, groceries, buy 2 cereal"
                  />
                  <Button type="button">
                    <Search className="h-4 w-4" aria-hidden="true" />
                    Compare
                  </Button>
                </div>
              </label>
              <div className="mt-4 flex flex-wrap gap-2">
                {categories.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCategory(option)}
                    className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                      category === option
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              {sources.map((source) => (
                <article key={source.name} className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-foreground">{source.name}</h3>
                      <p className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">{source.category}</p>
                    </div>
                    {source.supportsMultiBuy && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                        Multi-buy
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{source.notes}</p>
                  <Button
                    className="mt-4 w-full"
                    variant="outline"
                    render={
                      <a href={buildUniversalSearchUrl(source, query)} target="_blank" rel="noopener noreferrer sponsored">
                        Search {source.name}
                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      </a>
                    }
                  />
                </article>
              ))}
            </div>

            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <ShoppingBasket className="h-4 w-4 text-primary" aria-hidden="true" />
                Sample universal matches
              </p>
              <div className="mt-3 grid gap-2">
                {sampleUniversalResults.map((result) => (
                  <div key={`${result.source.name}-${result.query}`} className="rounded-xl bg-card p-3 text-sm">
                    <p className="font-medium text-foreground">{result.source.name}: {result.offer}</p>
                    <p className="mt-1 text-muted-foreground">{result.query} · {result.estimatedPrice}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
