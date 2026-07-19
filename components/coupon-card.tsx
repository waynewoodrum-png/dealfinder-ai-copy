"use client"

import { useState } from "react"
import { Check, Copy, ExternalLink, TicketPercent } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Coupon } from "@/lib/coupons"

type CouponCardProps = {
  coupon: Coupon
  redeemHref: string
}

export function CouponCard({ coupon, redeemHref }: CouponCardProps) {
  const [copied, setCopied] = useState(false)

  async function copyCode() {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(coupon.code)
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <TicketPercent className="h-4 w-4 text-primary" aria-hidden="true" />
            {coupon.title}
          </p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{coupon.description}</p>
        </div>
        {coupon.featured && (
          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">Featured</span>
        )}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => void copyCode()}
          className="inline-flex min-h-9 items-center gap-2 rounded-lg border border-dashed border-primary/50 bg-primary/5 px-3 font-mono text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          aria-label={`Copy coupon code ${coupon.code}`}
        >
          {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {coupon.code}
        </button>
        <Button
          size="sm"
          variant="outline"
          render={
            <a href={redeemHref} target="_blank" rel="noopener noreferrer sponsored">
              Redeem
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
            </a>
          }
        />
        <span className="text-xs text-muted-foreground">Expires {coupon.expiresAt}</span>
      </div>
    </div>
  )
}
