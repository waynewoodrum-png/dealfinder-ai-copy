"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import {
  DollarSign,
  MousePointerClick,
  TrendingUp,
  Save,
  Store,
  Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { saveAffiliateSettings, type AffiliateStats } from "@/app/actions/affiliate"
import type { AffiliateConfig } from "@/lib/affiliate"
import { formatMoney } from "@/lib/affiliate"

export function AffiliatePanel({
  config,
  stats,
}: {
  config: AffiliateConfig
  stats: AffiliateStats
}) {
  const router = useRouter()
  const [amazonTag, setAmazonTag] = useState(config.amazonTag)
  const [linkWrapperBase, setLinkWrapperBase] = useState(config.linkWrapperBase)
  const [ratePct, setRatePct] = useState(String((config.commissionRate * 100).toFixed(1)))
  const [enabled, setEnabled] = useState(config.enabled)
  const [saved, setSaved] = useState(false)
  const [saving, startSave] = useTransition()

  const avgPerClick = stats.totalClicks > 0 ? stats.estEarnings / stats.totalClicks : 0

  function handleSave() {
    setSaved(false)
    startSave(async () => {
      await saveAffiliateSettings({
        amazonTag,
        linkWrapperBase,
        commissionRate: (Number(ratePct) || 0) / 100,
        enabled,
      })
      setSaved(true)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Earnings summary */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          icon={<DollarSign className="h-5 w-5" aria-hidden="true" />}
          label="Estimated earnings"
          value={formatMoney(stats.estEarnings)}
          highlight
        />
        <StatCard
          icon={<MousePointerClick className="h-5 w-5" aria-hidden="true" />}
          label="Affiliate clicks"
          value={String(stats.totalClicks)}
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" aria-hidden="true" />}
          label="Avg. per click"
          value={formatMoney(avgPerClick)}
        />
      </div>

      <p className="flex items-start gap-2 rounded-lg border border-border bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
        Earnings are projected estimates based on your commission rate and tracked clicks. Actual
        payouts are reported by each affiliate program (Amazon Associates, Rakuten, etc.).
      </p>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <DollarSign className="h-4 w-4" aria-hidden="true" />
            </span>
            Affiliate settings
          </CardTitle>
          <CardDescription>
            Connect your affiliate accounts so every &quot;Shop&quot; link earns you commission.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 rounded-lg border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Affiliate links enabled</p>
              <p className="text-xs text-muted-foreground">
                Show &quot;Shop&quot; buttons on deals and shopping lists.
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={() => setEnabled((v) => !v)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                enabled ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-background transition-transform ${
                  enabled ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amazonTag">Amazon Associates tag</Label>
            <Input
              id="amazonTag"
              value={amazonTag}
              onChange={(e) => setAmazonTag(e.target.value)}
              placeholder="yourtag-20"
              className="h-11 text-base"
            />
            <p className="text-xs text-muted-foreground">
              Works instantly on Amazon links. Get one free at affiliate-program.amazon.com.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="wrapper">Link wrapper base (optional)</Label>
            <Input
              id="wrapper"
              value={linkWrapperBase}
              onChange={(e) => setLinkWrapperBase(e.target.value)}
              placeholder="https://go.skimresources.com/?id=XXXX&url="
              className="h-11 text-base"
            />
            <p className="text-xs text-muted-foreground">
              For networks like Skimlinks, Sovrn, or Rakuten. Non-Amazon links get wrapped with this
              prefix.
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rate">Estimated commission rate (%)</Label>
            <Input
              id="rate"
              inputMode="decimal"
              value={ratePct}
              onChange={(e) => setRatePct(e.target.value.replace(/[^0-9.]/g, ""))}
              placeholder="3"
              className="h-11 w-32 text-base"
            />
            <p className="text-xs text-muted-foreground">
              Used only to project earnings on your dashboard.
            </p>
          </div>

          <Button onClick={handleSave} disabled={saving} className="min-h-11 self-start">
            {saved && !saving ? (
              "Saved"
            ) : (
              <>
                <Save className="h-4 w-4" aria-hidden="true" />
                Save settings
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Top merchants */}
      {stats.topMerchants.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Top merchants</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 pb-4">
            {stats.topMerchants.map((m) => (
              <div key={m.merchant} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Store className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="text-sm font-medium text-foreground">{m.merchant}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{m.clicks} clicks</span>
                  <span className="font-mono text-sm font-medium text-primary">
                    {formatMoney(m.est)}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Recent activity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Recent shop clicks</CardTitle>
        </CardHeader>
        <CardContent className="pb-4">
          {stats.recent.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              No affiliate clicks yet. When shoppers use a &quot;Shop&quot; link, it&apos;ll show up
              here.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {stats.recent.map((r, i) => (
                <li key={r.id}>
                  {i > 0 && <Separator className="mb-2" />}
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{r.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {r.merchant} · {new Date(r.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <Badge variant="secondary" className="bg-accent text-accent-foreground">
                        {r.source}
                      </Badge>
                      <span className="font-mono text-sm font-medium text-primary">
                        +{formatMoney(r.est)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  highlight,
}: {
  icon: React.ReactNode
  label: string
  value: string
  highlight?: boolean
}) {
  return (
    <Card className={highlight ? "border-primary/30 bg-primary/5" : ""}>
      <CardContent className="flex flex-col gap-2 pt-6">
        <span
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${
            highlight ? "bg-primary text-primary-foreground" : "bg-accent text-accent-foreground"
          }`}
        >
          {icon}
        </span>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="font-mono text-2xl font-semibold text-foreground">{value}</p>
        </div>
      </CardContent>
    </Card>
  )
}
