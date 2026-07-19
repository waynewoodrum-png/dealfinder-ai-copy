import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft, BadgeDollarSign, MapPin, TicketPercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { MerchantLeadForm } from "@/components/merchant-lead-form"
import { merchantPackages } from "@/lib/merchant-monetization"

export const metadata: Metadata = {
  title: "Get featured on DealFinder AI",
  description: "Restaurants and local businesses can request featured placement, coupon campaigns, and zip-code sponsorships on DealFinder AI.",
}

export default function MerchantsPage() {
  return (
    <main className="min-h-svh bg-background">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <Button
            variant="ghost"
            render={
              <Link href="/">
                <ArrowLeft className="h-4 w-4" />
                Back home
              </Link>
            }
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <BadgeDollarSign className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                Merchant lead capture
              </span>
              <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
                Get your deal featured by zip code
              </h1>
              <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                DealFinder helps customers search by budget, zip code, coupons, pickup links, delivery links, and date-night bundles.
                Submit your offer to test a featured placement.
              </p>
              <div className="mt-6 rounded-2xl border border-dashed border-border bg-muted/30 p-5 text-sm text-muted-foreground">
                <p className="flex items-center gap-2 font-medium text-foreground">
                  <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                  Early pilot model
                </p>
                <p className="mt-2">
                  This starts as manual lead capture. Add payments later after you validate demand with restaurants and local businesses.
                </p>
              </div>
            </div>
            <MerchantLeadForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-2xl font-semibold text-foreground">Featured placement packages</h2>
        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {merchantPackages.map((tier) => (
            <article key={tier.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
              <p className="mt-2 font-mono text-2xl font-semibold text-primary">{tier.price}</p>
              <p className="mt-2 text-sm text-muted-foreground">{tier.bestFor}</p>
              <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <TicketPercent className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
