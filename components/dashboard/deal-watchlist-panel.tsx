import { Bell, CalendarDays, ExternalLink, Radar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildWatchSearchUrl, dealWatches, savingsFromUsual, statusLabel, targetGap } from "@/lib/deal-watchlist"
import { formatCurrency } from "@/lib/deal-stats"

export function DealWatchlistPanel() {
  return (
    <div className="flex flex-col gap-5">
      <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
          <Radar className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
          Deal watch engine
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight text-foreground">Track target prices and upcoming drops</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Watch any brand, grocery item, TV, shoes, or home product. DealFinder can alert when the item hits your price,
          when a rollback-style drop appears, or when a weekly sale cycle is coming up.
        </p>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        {dealWatches.map((watch) => {
          const gap = targetGap(watch)
          const savings = savingsFromUsual(watch)

          return (
            <article key={watch.id} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {statusLabel(watch.status)}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">{watch.category}</span>
                  </div>
                  <h2 className="mt-3 text-lg font-semibold text-foreground">{watch.brand} {watch.item}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{watch.merchant}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-2xl font-semibold text-primary">{formatCurrency(watch.currentPrice)}</p>
                  <p className="text-xs text-muted-foreground">target {formatCurrency(watch.targetPrice)}</p>
                </div>
              </div>

              <div className="mt-4 grid gap-2 rounded-xl bg-muted p-3 text-sm sm:grid-cols-2">
                <p className="flex items-center gap-2"><Tag className="h-4 w-4 text-primary" /> Saved vs usual: {formatCurrency(savings)}</p>
                <p className="flex items-center gap-2"><Bell className="h-4 w-4 text-primary" /> {gap === 0 ? "Alert now" : `${formatCurrency(gap)} above target`}</p>
                {watch.upcomingDate && (
                  <p className="flex items-center gap-2 sm:col-span-2"><CalendarDays className="h-4 w-4 text-primary" /> Watch again on {watch.upcomingDate}</p>
                )}
              </div>

              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{watch.note}</p>
              <Button
                className="mt-4 w-full"
                variant="outline"
                render={
                  <a href={buildWatchSearchUrl(watch)} target="_blank" rel="noopener noreferrer">
                    Search live price drops
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                }
              />
            </article>
          )
        })}
      </div>

      <section className="rounded-2xl border border-dashed border-border bg-muted/30 p-5">
        <p className="text-sm font-semibold text-foreground">Future live integrations</p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Connect retailer, grocery, marketplace, and email notification APIs later to send real alerts. The current MVP
          models the watchlist UX, target prices, upcoming sale days, and rollback-style labels.
        </p>
      </section>
    </div>
  )
}
