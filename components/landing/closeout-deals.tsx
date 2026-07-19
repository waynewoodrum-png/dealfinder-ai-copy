import { ArrowRight, Clock, ExternalLink, Flame, PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildCloseoutSearchUrl, closeoutDeals, closeoutDiscount, closeoutSavings } from "@/lib/closeout-deals"

function money(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" })
}

export function CloseoutDeals() {
  return (
    <section id="closeout-deals" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <PackageSearch className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Closeout finder
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Find food markdowns, clearance racks, open-box deals, and last-chance closeouts
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Closeouts are where shoppers can win big: end-of-day food markdowns, seasonal apparel, overstock home
              goods, open-box electronics, and weekly ad clearance. DealFinder groups them across stores instead of
              making users check every app.
            </p>
            <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-5 text-sm text-muted-foreground">
              <p className="flex items-center gap-2 font-medium text-foreground">
                <Clock className="h-4 w-4 text-primary" aria-hidden="true" />
                Why this matters
              </p>
              <p className="mt-2">
                Food and grocery closeouts are time-sensitive. Apparel, electronics, and home closeouts are inventory-sensitive.
                This gives users a reason to check the app often.
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            {closeoutDeals.map((deal) => (
              <article key={`${deal.sourceName}-${deal.title}`} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                        {deal.urgency}
                      </span>
                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                        {deal.sourceName} · {deal.category}
                      </span>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold text-foreground">{deal.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{deal.markdownReason}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-mono text-xl font-semibold text-primary">{money(deal.closeoutPrice)}</p>
                    <p className="text-xs text-muted-foreground line-through">{money(deal.usualPrice)}</p>
                  </div>
                </div>
                <div className="mt-4 grid gap-2 rounded-xl bg-muted p-3 text-sm sm:grid-cols-3">
                  <p className="flex items-center gap-2"><Flame className="h-4 w-4 text-primary" /> Save {money(closeoutSavings(deal))}</p>
                  <p>{closeoutDiscount(deal)}% markdown</p>
                  <p>{deal.bestFor}</p>
                </div>
                <Button
                  className="mt-4 w-full"
                  variant="outline"
                  render={
                    <a href={buildCloseoutSearchUrl(deal)} target="_blank" rel="noopener noreferrer sponsored">
                      Search closeout source
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  }
                />
              </article>
            ))}
            <Button className="w-full" render={<a href="#universal-deal-search">Compare closeouts across sources<ArrowRight className="h-4 w-4" /></a>} />
          </div>
        </div>
      </div>
    </section>
  )
}
