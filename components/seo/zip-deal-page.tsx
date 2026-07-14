import Link from "next/link"
import { ArrowRight, CalendarHeart, MapPin, Store, TicketPercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getSeoDateNightDeals, getSeoRestaurantDeals, getZipLabel } from "@/lib/seo-zip"

type ZipDealPageProps = {
  zipCode: string
  variant: "all" | "restaurants" | "date-night"
}

const copy = {
  all: {
    eyebrow: "Local deal SEO page",
    title: "AI deals near",
    description: "Find restaurant deals, coupons, pickup links, delivery links, and date-night bundles in this zip code.",
  },
  restaurants: {
    eyebrow: "Restaurants under $50",
    title: "Restaurants under $50 near",
    description: "Find budget-friendly restaurant options for two people with coupons and pickup or delivery links.",
  },
  "date-night": {
    eyebrow: "Date-night deal SEO page",
    title: "Date-night deals near",
    description: "Find dinner, activity, and dessert bundles under a local budget with coupon and delivery options.",
  },
}

export function ZipDealPage({ zipCode, variant }: ZipDealPageProps) {
  const zip = getZipLabel(zipCode)
  const restaurantDeals = getSeoRestaurantDeals(zip)
  const dateNightDeals = getSeoDateNightDeals(zip)
  const pageCopy = copy[variant]
  const showRestaurants = variant === "all" || variant === "restaurants"
  const showDateNight = variant === "all" || variant === "date-night"

  return (
    <main className="min-h-svh bg-background">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            {pageCopy.eyebrow}
          </span>
          <h1 className="mt-5 max-w-3xl text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            {pageCopy.title} {zip}
          </h1>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            {pageCopy.description} Users finish orders with the restaurant or delivery provider.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={
                <Link href="/sign-up">
                  Try DealFinder AI
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
            <Button variant="outline" render={<Link href="/merchants">Get your restaurant featured</Link>} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        {showRestaurants && (
          <div>
            <div className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-foreground">Restaurant deals under $50</h2>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {restaurantDeals.map((deal) => (
                <article key={deal.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">{deal.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{deal.neighborhood} · {deal.cuisine}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{deal.deal}</p>
                  <p className="mt-3 font-mono text-xl font-semibold text-primary">~${deal.estimatedForParty}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        {showDateNight && (
          <div className={showRestaurants ? "mt-12" : ""}>
            <div className="flex items-center gap-2">
              <CalendarHeart className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-2xl font-semibold text-foreground">Date-night bundles</h2>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-2">
              {dateNightDeals.map((bundle) => (
                <article key={bundle.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-foreground">{bundle.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{bundle.vibe}</p>
                  <p className="mt-4 text-sm text-muted-foreground">{bundle.dinner} · {bundle.activity} · {bundle.dessert}</p>
                  <p className="mt-3 font-mono text-xl font-semibold text-primary">~${bundle.total}</p>
                </article>
              ))}
            </div>
          </div>
        )}

        <div className="mt-12 rounded-2xl border border-dashed border-border bg-muted/30 p-5">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            <TicketPercent className="h-4 w-4 text-primary" aria-hidden="true" />
            For local businesses
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Restaurants can request featured placement, coupon campaigns, delivery links, and date-night bundle placement by zip code.
          </p>
        </div>
      </section>
    </main>
  )
}
