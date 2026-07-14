import { ExternalLink, Megaphone, Store } from "lucide-react"
import { buildAffiliateUrl, DEFAULT_AFFILIATE_CONFIG, type AffiliateConfig } from "@/lib/affiliate"
import { Button } from "@/components/ui/button"

const featuredRetailers = [
  { name: "Walmart", query: "weekly deals" },
  { name: "Lowe's", query: "home improvement deals" },
  { name: "Home Depot", query: "appliance deals" },
  { name: "Best Buy", query: "electronics deals" },
]

function getAffiliateConfig(): AffiliateConfig {
  const commissionRate = Number(process.env.AFFILIATE_COMMISSION_RATE ?? DEFAULT_AFFILIATE_CONFIG.commissionRate)

  return {
    ...DEFAULT_AFFILIATE_CONFIG,
    amazonTag: process.env.AMAZON_ASSOCIATES_TAG ?? DEFAULT_AFFILIATE_CONFIG.amazonTag,
    linkWrapperBase: process.env.AFFILIATE_LINK_WRAPPER_BASE ?? DEFAULT_AFFILIATE_CONFIG.linkWrapperBase,
    commissionRate: Number.isFinite(commissionRate) ? commissionRate : DEFAULT_AFFILIATE_CONFIG.commissionRate,
    enabled: process.env.AFFILIATE_LINKS_ENABLED !== "false",
  }
}

export function RetailMedia() {
  const config = getAffiliateConfig()

  return (
    <section id="retail-partners" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Megaphone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Retail media ready
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Promote major storefront deals and earn from qualified clicks
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              DealFinder can surface sponsored and affiliate-ready placements for large retailers. Add approved network
              links, campaign IDs, and brand assets when your affiliate or advertising accounts are approved.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Disclosure: storefront links should be treated as sponsored or affiliate placements when tracking is enabled.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featuredRetailers.map((retailer) => {
              const href = config.enabled
                ? buildAffiliateUrl(retailer.name, retailer.query, config)
                : buildAffiliateUrl(retailer.name, retailer.query, { ...config, linkWrapperBase: "", amazonTag: "" })

              return (
                <article key={retailer.name} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Store className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                      Featured
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-foreground">{retailer.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Drive shoppers to current {retailer.query} with trackable outbound links.
                  </p>
                  <Button
                    className="mt-4 w-full"
                    variant="outline"
                    render={
                      <a href={href} target="_blank" rel="noopener noreferrer sponsored">
                        View deals
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
