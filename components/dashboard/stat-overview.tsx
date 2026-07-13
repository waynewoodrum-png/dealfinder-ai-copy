import { Flame, Tag, PiggyBank, TrendingDown } from "lucide-react"
import { Card } from "@/components/ui/card"
import { type DealStats, formatCurrency } from "@/lib/deal-stats"

export function StatOverview({ stats }: { stats: DealStats }) {
  return (
    <section aria-label="Savings overview" className="grid gap-4">
      <Card className="overflow-hidden border-border bg-card p-6 sm:p-8">
        <div className="flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted-foreground">
          <PiggyBank className="h-4 w-4 text-primary" aria-hidden="true" />
          Total saved
        </div>
        <p className="mt-3 font-mono text-4xl font-semibold tracking-tight text-primary sm:text-6xl">
          {formatCurrency(stats.totalSaved)}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          From {stats.claimedCount} claimed {stats.claimedCount === 1 ? "deal" : "deals"}
          {stats.potentialSaved > 0 && (
            <>
              {" · "}
              <span className="text-foreground">{formatCurrency(stats.potentialSaved)}</span> more available to claim
            </>
          )}
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <MiniStat
          icon={<Flame className="h-4 w-4" aria-hidden="true" />}
          label="Savings streak"
          value={`${stats.streakWeeks} ${stats.streakWeeks === 1 ? "week" : "weeks"}`}
          hint="Keep claiming weekly"
        />
        <MiniStat
          icon={<Tag className="h-4 w-4" aria-hidden="true" />}
          label="Avg. discount"
          value={`${stats.avgDiscount}%`}
          hint="Across all tracked deals"
        />
        <MiniStat
          icon={<TrendingDown className="h-4 w-4" aria-hidden="true" />}
          label="Active deals"
          value={String(stats.activeCount)}
          hint="Ready to claim now"
        />
      </div>
    </section>
  )
}

function MiniStat({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode
  label: string
  value: string
  hint: string
}) {
  return (
    <Card className="border-border bg-card p-5">
      <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span className="text-primary">{icon}</span>
        {label}
      </div>
      <p className="mt-2 font-mono text-2xl font-semibold text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  )
}
