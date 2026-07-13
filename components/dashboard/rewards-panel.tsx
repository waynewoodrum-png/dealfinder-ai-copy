"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Coins, Gift, TrendingUp, Wallet, Check, Sparkles } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { redeemCoins, type CoinSummary } from "@/app/actions/coins"
import { REDEEM_TIERS, COINS_PER_DOLLAR, formatCoins } from "@/lib/coins"

function money(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
}

export function RewardsPanel({ summary }: { summary: CoinSummary }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [custom, setCustom] = useState("")
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null)

  const maxDollars = Math.floor(summary.balance / COINS_PER_DOLLAR)

  const doRedeem = (dollars: number) => {
    setMessage(null)
    startTransition(async () => {
      const result = await redeemCoins(dollars)
      if (result.ok) {
        setMessage({ type: "ok", text: `Redeemed ${money(result.dollars)} off your next purchase!` })
        setCustom("")
        router.refresh()
      } else {
        setMessage({ type: "error", text: result.error })
      }
    })
  }

  const progressToNextDollar = ((summary.balance % COINS_PER_DOLLAR) / COINS_PER_DOLLAR) * 100

  return (
    <div className="flex flex-col gap-6">
      {/* Balance hero */}
      <Card className="overflow-hidden border-primary/20 bg-primary/5 p-0">
        <div className="flex flex-col gap-4 p-6">
          <div className="flex items-center gap-2 text-primary">
            <Coins className="h-5 w-5" aria-hidden="true" />
            <span className="text-sm font-medium uppercase tracking-wide">Coin balance</span>
          </div>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-semibold tracking-tight text-foreground tabular-nums">
              {formatCoins(summary.balance)}
            </span>
            <span className="pb-2 text-lg text-muted-foreground">coins</span>
          </div>
          <p className="text-sm text-muted-foreground text-pretty">
            Worth <span className="font-semibold text-foreground">{money(summary.balance / COINS_PER_DOLLAR)}</span>{" "}
            toward your next purchase. {COINS_PER_DOLLAR} coins = $1.
          </p>
          <div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progressToNextDollar}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {COINS_PER_DOLLAR - (summary.balance % COINS_PER_DOLLAR)} more coins to your next $1
            </p>
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">Lifetime earned</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
            {formatCoins(summary.lifetimeEarned)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Wallet className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">Discount credit</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">
            {money(summary.availableDollars)}
          </p>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Coins className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-medium uppercase tracking-wide">Redeemable now</span>
          </div>
          <p className="mt-2 text-2xl font-semibold text-foreground tabular-nums">{money(maxDollars)}</p>
        </Card>
      </div>

      {/* Redeem */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">Redeem your coins</h2>
        </div>
        <p className="mt-1 text-sm text-muted-foreground text-pretty">
          Convert coins into a discount credit for your next purchase.
        </p>

        {message && (
          <div
            role="status"
            className={`mt-4 flex items-center gap-2 rounded-lg border p-3 text-sm ${
              message.type === "ok"
                ? "border-primary/30 bg-primary/5 text-foreground"
                : "border-destructive/30 bg-destructive/5 text-destructive"
            }`}
          >
            {message.type === "ok" && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
            {message.text}
          </div>
        )}

        <div className="mt-5">
          <p className="text-sm font-medium text-foreground">Quick tiers</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            {REDEEM_TIERS.map((tier) => {
              const cost = tier * COINS_PER_DOLLAR
              const affordable = summary.balance >= cost
              return (
                <button
                  key={tier}
                  type="button"
                  disabled={!affordable || pending}
                  onClick={() => doRedeem(tier)}
                  className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card p-3 text-center transition-colors hover:border-primary hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-xl font-semibold text-foreground">${tier}</span>
                  <span className="text-xs text-muted-foreground">{formatCoins(cost)} coins</span>
                </button>
              )
            })}
          </div>
        </div>

        <Separator className="my-5" />

        <div>
          <Label htmlFor="custom-redeem" className="text-sm font-medium text-foreground">
            Custom amount
          </Label>
          <div className="mt-2 flex items-center gap-3">
            <div className="relative flex-1">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                $
              </span>
              <Input
                id="custom-redeem"
                type="number"
                inputMode="numeric"
                min={1}
                max={maxDollars || undefined}
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="0"
                className="h-11 pl-7 text-base"
              />
            </div>
            <Button
              className="h-11"
              disabled={pending || !custom || Number(custom) < 1}
              onClick={() => doRedeem(Number(custom))}
            >
              Redeem
            </Button>
          </div>
          <p className="mt-1.5 text-xs text-muted-foreground">
            {maxDollars > 0
              ? `You can redeem up to ${money(maxDollars)} right now.`
              : "Earn more coins by keeping your savings streak alive."}
          </p>
        </div>
      </Card>

      {/* How to earn */}
      <Card className="border-dashed p-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold text-foreground">How to earn coins</h2>
        </div>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-muted-foreground">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            Claim at least one deal in a week to earn <strong className="text-foreground">10 coins</strong> for that
            week.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-primary">•</span>
            Keep your streak going for milestone bonuses:{" "}
            <strong className="text-foreground">2 weeks (+20)</strong>,{" "}
            <strong className="text-foreground">4 weeks (+50)</strong>,{" "}
            <strong className="text-foreground">8 weeks (+120)</strong>, and{" "}
            <strong className="text-foreground">12 weeks (+200)</strong>.
          </li>
        </ul>
      </Card>

      {/* History */}
      {summary.transactions.length > 0 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground">Activity</h2>
          <ul className="mt-3 divide-y divide-border">
            {summary.transactions.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">{t.reason}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(t.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold tabular-nums ${
                    t.type === "earn" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {t.type === "earn" ? "+" : "-"}
                  {formatCoins(t.coins)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
