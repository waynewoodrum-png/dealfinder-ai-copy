import Link from "next/link"
import { ArrowRight, BadgeDollarSign, MapPin, TicketPercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { merchantPackages } from "@/lib/merchant-monetization"

export function MerchantRevenue() {
  return (
    <section id="merchant-revenue" className="border-t border-border bg-background">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeDollarSign className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Merchant revenue engine
          </span>
          <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Sell featured deal placement by zip code
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Restaurants and local businesses can pay to promote coupons, pickup links, delivery links, and date-night
            bundles in the zip codes where customers are searching.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {merchantPackages.map((tier) => (
            <article key={tier.name} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-medium text-primary">{tier.bestFor}</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-2 font-mono text-3xl font-semibold text-foreground">{tier.price}</p>
              <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <TicketPercent className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="mt-6 w-full"
                render={
                  <Link href="/dashboard/merchant">
                    {tier.cta}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                }
              />
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
          <p className="flex items-center gap-2 font-medium text-foreground">
            <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
            No food checkout required
          </p>
          <p className="mt-2">
            DealFinder sells discovery, featured placement, coupon exposure, and campaign tracking. Customers still order
            with the restaurant or delivery provider.
          </p>
        </div>
      </div>
    </section>
  )
}
