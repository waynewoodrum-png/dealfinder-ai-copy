"use client"

import { FormEvent, useMemo, useState } from "react"
import { CalendarHeart, DollarSign, ExternalLink, LocateFixed, Search, Sparkles, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildDateNightSearchUrl, findDateNightBundles } from "@/lib/date-night-deals"
import { buildDeliveryLinks } from "@/lib/delivery-links"
import { normalizeZipCode } from "@/lib/restaurant-deals"

const vibes = ["Any", "Casual", "Relaxed", "Playful", "Low-key"]

export function DateNightDealFinder() {
  const [zipCode, setZipCode] = useState("27601")
  const [budget, setBudget] = useState("80")
  const [vibe, setVibe] = useState("Any")
  const [hasSearched, setHasSearched] = useState(true)

  const normalizedZip = normalizeZipCode(zipCode)
  const numericBudget = Math.max(0, Number(budget) || 0)
  const wrapperBase = process.env.NEXT_PUBLIC_DATE_NIGHT_LINK_WRAPPER_BASE ?? ""
  const deliveryWrapperBase = process.env.NEXT_PUBLIC_DELIVERY_LINK_WRAPPER_BASE ?? ""
  const bundles = useMemo(
    () => findDateNightBundles(numericBudget, normalizedZip, vibe).slice(0, 3),
    [numericBudget, normalizedZip, vibe],
  )

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setHasSearched(true)
  }

  return (
    <section id="date-night-finder" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <CalendarHeart className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              AI bundle finder
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Build the best date night deal in one search
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              DealFinder can package dinner, an activity, and dessert into one zip-targeted plan. This creates premium
              featured inventory for restaurants, venues, dessert shops, and local bundle sponsors.
            </p>

            <form onSubmit={onSubmit} className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="grid gap-4 sm:grid-cols-3">
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
                      aria-label="Date night zip code"
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
                      aria-label="Date night budget"
                    />
                  </span>
                </label>
                <label className="text-sm font-medium text-foreground">
                  Vibe
                  <select
                    value={vibe}
                    onChange={(event) => setVibe(event.target.value)}
                    className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
                    aria-label="Date night vibe"
                  >
                    {vibes.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <Button className="mt-5 min-h-11 w-full" type="submit">
                <Search className="h-4 w-4" aria-hidden="true" />
                Build date night near {normalizedZip || "my zip"} under ${numericBudget || 0}
              </Button>
            </form>
          </div>

          <div className="space-y-4">
            {hasSearched && bundles.length === 0 && (
              <div className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground">
                No full date-night bundle fits yet. Try a higher budget, “Any” vibe, or another zip code.
              </div>
            )}

            {hasSearched &&
              bundles.map((bundle, index) => {
                const href = buildDateNightSearchUrl(bundle.title, normalizedZip, wrapperBase)
                const deliveryLinks = buildDeliveryLinks(bundle.restaurantName, normalizedZip, deliveryWrapperBase)

                return (
                  <article key={bundle.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-primary px-2.5 py-1 text-xs font-semibold text-primary-foreground">
                            #{index + 1} bundle
                          </span>
                          {bundle.localMatch && (
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              Local zip match
                            </span>
                          )}
                          {bundle.featured && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                              Premium slot
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-foreground">{bundle.title}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{bundle.vibe}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-mono text-xl font-semibold text-primary">${bundle.total}</p>
                        <p className="text-xs text-muted-foreground">save about ${bundle.savings}</p>
                      </div>
                    </div>
                    <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                      <p className="rounded-xl bg-muted p-3">
                        <Utensils className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
                        {bundle.dinner}
                      </p>
                      <p className="rounded-xl bg-muted p-3">
                        <Sparkles className="mb-2 h-4 w-4 text-primary" aria-hidden="true" />
                        {bundle.activity}
                      </p>
                      <p className="rounded-xl bg-muted p-3">{bundle.dessert}</p>
                    </div>
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      <Button
                        className="w-full"
                        variant="outline"
                        render={
                          <a href={href} target="_blank" rel="noopener noreferrer sponsored">
                            Search this bundle
                            <ExternalLink className="h-4 w-4" aria-hidden="true" />
                          </a>
                        }
                      />
                      {deliveryLinks.slice(0, 2).map((delivery) => (
                        <Button
                          key={delivery.service}
                          className="w-full"
                          variant="outline"
                          render={
                            <a href={delivery.href} target="_blank" rel="noopener noreferrer sponsored">
                              Deliver with {delivery.service}
                              <ExternalLink className="h-4 w-4" aria-hidden="true" />
                            </a>
                          }
                        />
                      ))}
                    </div>
                  </article>
                )
              })}

            <div className="rounded-2xl border border-dashed border-border bg-card p-5">
              <p className="text-sm font-medium text-foreground">Premium monetization layer</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Bundle campaigns can sell higher-value placement than one-off restaurant clicks: dinner + event + dessert
                packages, delivery clicks, sponsored local collections, and pay-per-redemption date-night coupons.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
