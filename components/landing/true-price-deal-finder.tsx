"use client"

import { FormEvent, useMemo, useState } from "react"
import { BadgeDollarSign, DollarSign, ExternalLink, LocateFixed, ReceiptText, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildDeliveryLinks } from "@/lib/delivery-links"
import { buildRestaurantSearchUrl, normalizeZipCode } from "@/lib/restaurant-deals"
import { findBestDealMatches, type FulfillmentMode } from "@/lib/true-price-deals"

export function TruePriceDealFinder() {
  const [zipCode, setZipCode] = useState("27601")
  const [budget, setBudget] = useState("50")
  const [partySize, setPartySize] = useState("2")
  const [mode, setMode] = useState<FulfillmentMode | "best">("best")
  const [hasSearched, setHasSearched] = useState(true)

  const normalizedZip = normalizeZipCode(zipCode)
  const numericBudget = Math.max(0, Number(budget) || 0)
  const numericPartySize = Math.max(1, Number(partySize) || 1)
  const restaurantWrapperBase = process.env.NEXT_PUBLIC_RESTAURANT_LINK_WRAPPER_BASE ?? ""
  const deliveryWrapperBase = process.env.NEXT_PUBLIC_DELIVERY_LINK_WRAPPER_BASE ?? ""
  const deals = useMemo(
    () => findBestDealMatches(numericBudget, normalizedZip, numericPartySize, mode).slice(0, 3),
    [mode, normalizedZip, numericBudget, numericPartySize],
  )

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSearched(true)
  }

  return (
    <section id="best-deal-finder" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <BadgeDollarSign className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Best Deal Match
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Find the best deal without becoming the ordering app
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              DealFinder compares menu estimates, coupons, pickup links, and delivery links, then sends users to the
              restaurant or delivery service to finish the order. Your app stays focused on discovery, coupons, and referrals.
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
                      aria-label="Best deal zip code"
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
                      aria-label="Best deal budget"
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
                    aria-label="Best deal party size"
                  />
                </label>
                <label className="text-sm font-medium text-foreground">
                  Method
                  <select
                    value={mode}
                    onChange={(event) => setMode(event.target.value as FulfillmentMode | "best")}
                    className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Pickup or delivery"
                  >
                    <option value="best">Best match</option>
                    <option value="pickup">Pickup</option>
                    <option value="delivery">Delivery link</option>
                  </select>
                </label>
              </div>
              <Button className="mt-5 min-h-11 w-full" type="submit">
                <Search className="h-4 w-4" aria-hidden="true" />
                Find best matches under ${numericBudget || 0}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            {hasSearched && deals.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                No best-match deals fit this budget. Try pickup, fewer people, or a higher budget.
              </div>
            )}

            {hasSearched &&
              deals.map((deal, index) => {
                const menuHref = buildRestaurantSearchUrl(deal.restaurant.name, normalizedZip, restaurantWrapperBase)
                const deliveryHref = buildDeliveryLinks(deal.restaurant.name, normalizedZip, deliveryWrapperBase)[0]?.href
                const actionHref = deal.mode === "delivery" && deliveryHref ? deliveryHref : menuHref

                return (
                  <article key={`${deal.restaurant.name}-${deal.mode}`} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                            #{index + 1} best match
                          </span>
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                            {deal.mode === "delivery" ? "delivery link" : "pickup"}
                          </span>
                          {deal.localMatch && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Local zip match
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-foreground">{deal.restaurant.name}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{deal.restaurant.bestOrder}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-2xl font-semibold text-primary">${deal.estimatedDealTotal.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">estimated after coupon</p>
                      </div>
                    </div>

                    <div className="mt-4 grid gap-2 rounded-xl bg-muted p-3 text-sm sm:grid-cols-2">
                      <p>Menu estimate: ${deal.estimatedMenuTotal.toFixed(2)}</p>
                      <p>Coupon savings: -${deal.couponSavings.toFixed(2)} {deal.coupon ? `(${deal.coupon.code})` : ""}</p>
                      <p>Budget room: ${deal.budgetLeft.toFixed(2)}</p>
                      <p>Deal score: {Math.round(deal.dealScore)}</p>
                    </div>
                    <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <ReceiptText className="h-4 w-4 text-primary" aria-hidden="true" />
                      {deal.reason}
                    </p>
                    <Button
                      className="mt-4 w-full"
                      variant="outline"
                      render={
                        <a href={actionHref} target="_blank" rel="noopener noreferrer sponsored">
                          {deal.mode === "delivery" ? "Open delivery provider" : "Open pickup/menu option"}
                          <ExternalLink className="h-4 w-4" aria-hidden="true" />
                        </a>
                      }
                    />
                  </article>
                )
              })}
          </div>
        </div>
      </div>
    </section>
  )
}
