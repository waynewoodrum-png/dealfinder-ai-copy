import { redirect } from "next/navigation"
import { headers } from "next/headers"
import Link from "next/link"
import { ArrowLeft, BadgeDollarSign, MapPin, TicketPercent } from "lucide-react"
import { auth } from "@/lib/auth"
import { merchantPackages, sampleMerchantCampaign } from "@/lib/merchant-monetization"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function MerchantDashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader name={session.user.name} email={session.user.email} coinBalance={0} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <Button variant="ghost" render={<Link href="/dashboard"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link>} />

        <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
            <BadgeDollarSign className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            Merchant monetization
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">Sell featured deal placements</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Use this as the first merchant dashboard: package pricing, zip-code targeting, coupon campaigns, and lead
            capture. Payments can be added later; for now, this helps pitch and organize paid placements.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-3">
          {merchantPackages.map((tier) => (
            <article key={tier.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="text-sm font-medium text-primary">{tier.bestFor}</p>
              <h2 className="mt-3 text-lg font-semibold text-foreground">{tier.name}</h2>
              <p className="mt-2 font-mono text-2xl font-semibold text-foreground">{tier.price}</p>
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

        <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_0.9fr]">
          <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Sample campaign draft</h2>
            <div className="mt-4 grid gap-3 text-sm">
              {Object.entries(sampleMerchantCampaign).map(([key, value]) => (
                <div key={key} className="rounded-xl bg-muted p-3">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{key}</p>
                  <p className="mt-1 font-medium text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
              Next paid step
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Add Stripe later for featured-placement subscriptions. Until then, use these packages for direct outreach,
              invoices, or manual paid pilots with local restaurants.
            </p>
          </section>
        </div>
      </main>
    </div>
  )
}
