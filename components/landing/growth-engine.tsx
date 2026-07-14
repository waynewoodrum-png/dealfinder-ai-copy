"use client"

import { Copy, Megaphone, Send, Share2, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildCampaignUrl, buildShareText, growthCampaigns, merchantOutreachTemplate } from "@/lib/growth-engine"

export function GrowthEngine() {
  const shareText = buildShareText("27601", 50)
  const shareUrl = buildCampaignUrl("/", "user_referral", "zip_budget_share")

  async function copy(text: string) {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
    }
  }

  return (
    <section id="growth-engine" className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <Megaphone className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              Growth engine
            </span>
            <h2 className="mt-5 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Promote the app with zip-code deal stories
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Turn every search into content: “I found dinner for 2 under $50 in this zip code.” Use share links,
              campaign tracking, and merchant outreach to grow without building a spam bot.
            </p>
            <div className="mt-6 rounded-2xl border border-border bg-card p-5 shadow-sm">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Share2 className="h-4 w-4 text-primary" aria-hidden="true" />
                Referral-ready share prompt
              </p>
              <p className="mt-3 rounded-xl bg-muted p-3 text-sm leading-relaxed text-muted-foreground">{shareText}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => void copy(`${shareText}\n${shareUrl}`)}>
                  <Copy className="h-4 w-4" aria-hidden="true" />
                  Copy share text
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  render={
                    <a href={shareUrl}>
                      Open tracked link
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </a>
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {growthCampaigns.map((campaign) => {
              const campaignUrl = buildCampaignUrl("/", campaign.utmSource, campaign.title)

              return (
                <article key={campaign.title} className="rounded-2xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">{campaign.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{campaign.channel}</p>
                    </div>
                    <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                      {campaign.cta}
                    </span>
                  </div>
                  <p className="mt-4 rounded-xl bg-muted p-3 text-sm leading-relaxed text-muted-foreground">
                    {campaign.prompt}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => void copy(`${campaign.prompt}\n${campaignUrl}`)}>
                      <Copy className="h-4 w-4" aria-hidden="true" />
                      Copy campaign
                    </Button>
                    <span className="rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">{campaignUrl}</span>
                  </div>
                </article>
              )
            })}

            <article className="rounded-2xl border border-dashed border-border bg-card p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Store className="h-4 w-4 text-primary" aria-hidden="true" />
                Merchant outreach template
              </p>
              <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-muted p-3 text-xs leading-relaxed text-muted-foreground">
                {merchantOutreachTemplate}
              </pre>
              <Button className="mt-3" size="sm" onClick={() => void copy(merchantOutreachTemplate)}>
                <Copy className="h-4 w-4" aria-hidden="true" />
                Copy merchant pitch
              </Button>
            </article>
          </div>
        </div>
      </div>
    </section>
  )
}
