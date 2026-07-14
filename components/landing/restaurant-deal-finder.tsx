"use client"

import { FormEvent, useMemo, useState } from "react"
import { DollarSign, ExternalLink, LocateFixed, MapPin, Search, Sparkles, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildRestaurantSearchUrl, findRestaurantDeals, normalizeZipCode } from "@/lib/restaurant-deals"

const cuisines = ["Any", "American", "Asian", "BBQ", "Mexican", "Pizza"]

export function RestaurantDealFinder() {
  const [budget, setBudget] = useState("50")
  const [partySize, setPartySize] = useState("2")
  const [zipCode, setZipCode] = useState("27601")
  const [cuisine, setCuisine] = useState("Any")
  const [hasSearched, setHasSearched] = useState(true)

  const numericBudget = Math.max(0, Number(budget) || 0)
  const numericPartySize = Math.max(1, Number(partySize) || 1)
  const normalizedZip = normalizeZipCode(zipCode)
  const results = useMemo(
    () => findRestaurantDeals(numericBudget, cuisine, numericPartySize, normalizedZip).slice(0, 3),
    [numericBudget, cuisine, numericPartySize, normalizedZip],
  )
  const wrapperBase = process.env.NEXT_PUBLIC_RESTAURANT_LINK_WRAPPER_BASE ?? ""

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSearched(true)
  }

  return (
    <section id="restaurant-finder" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Utensils className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Zip-code deal finder
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Find the best local place to eat within your budget
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Example: “Find me a restaurant near 27601 where two people can eat for $50.” DealFinder ranks budget-fit
              options by zip code, budget room, and featured placement inventory.
            </p>

            <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <label className="text-sm font-medium text-foreground">
                  Zip code
                  <span className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3">
                    <LocateFixed className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <input
                      value={zipCode}
                      onChange={(event) => setZipCode(event.target.value)}
                      inputMode="numeric"
                      maxLength={5}
                      className="w-full bg-transparent text-sm outline-none"
                      aria-label="Zip code"
                    />
                  </span>
                </label>
                <label className="text-sm font-medium text-foreground">
                  Budget
                  <span className="mt-2 flex min-h-11 items-center gap-2 rounded-lg border border-border bg-background px-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <input
                      value={budget}
                      onChange={(event) => setBudget(event.target.value)}
                      inputMode="numeric"
                      className="w-full bg-transparent text-sm outline-none"
                      aria-label="Budget"
                    />
                  </span>
                </label>
                <label className="text-sm font-medium text-foreground">
                  People
                  <input
                    value={partySize}
                    onChange={(event) => setPartySize(event.target.value)}
                    inputMode="numeric"
                    className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Party size"
                  />
                </label>
                <label className="text-sm font-medium text-foreground">
                  Cuisine
                  <select
                    value={cuisine}
                    onChange={(event) => setCuisine(event.target.value)}
                    className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Cuisine"
                  >
                    {cuisines.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <Button className="mt-5 min-h-11 w-full" type="submit">
                <Search className="h-4 w-4" aria-hidden="true" />
                Find best deals near {normalizedZip || "my zip"} under ${numericBudget || 0}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            {hasSearched && results.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                No budget-fit matches in this sample yet. Try a higher budget, “Any” cuisine, or another zip code.
              </div>
            )}

            {hasSearched &&
              results.map((restaurant, index) => {
                const href = buildRestaurantSearchUrl(restaurant.name, normalizedZip, wrapperBase)

                return (
                  <article key={restaurant.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                            #{index + 1} best match
                          </span>
                          {restaurant.localMatch && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Local zip match
                            </span>
                          )}
                          {restaurant.featured && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              Featured slot
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-foreground">{restaurant.name}</h3>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                          {restaurant.neighborhood} · {restaurant.cuisine}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xl font-semibold text-primary">${restaurant.estimatedForParty}</p>
                        <p className="text-xs text-muted-foreground">estimated total</p>
                      </div>
                    </div>
                    <p className="mt-4 text-sm text-muted-foreground">{restaurant.deal}</p>
                    <p className="mt-2 text-sm text-foreground">
                      <span className="font-medium">Best order:</span> {restaurant.bestOrder}
                    </p>
                    <Button
                      className="mt-4 w-full"
                      variant="outline"
                      render={
                        <a href={href} target="_blank" rel="noopener noreferrer sponsored">
                          Search menu deals in {normalizedZip || "this area"}
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      }
                    />
                  </article>
                )
              })}

            <div className="rounded-2xl border border-dashed border-border bg-muted/30 p-5">
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Revenue path
              </p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Restaurants can pay for zip-targeted featured slots, reservation clicks, coupon redemptions, or local deal
                campaigns. Replace sample data with a live menu, reservation, or deals API when partner access is approved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
