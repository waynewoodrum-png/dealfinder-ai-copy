import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { type DealStats, formatCurrency } from "@/lib/deal-stats"

export function CategoryBreakdown({ stats }: { stats: DealStats }) {
  return (
    <Card className="border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">Savings by category</h2>
      <p className="mt-1 text-xs text-muted-foreground">Where your claimed savings come from</p>

      {stats.categories.length === 0 ? (
        <p className="mt-6 text-sm text-muted-foreground">Claim a deal to see your category breakdown.</p>
      ) : (
        <ul className="mt-5 flex flex-col gap-4">
          {stats.categories.map((cat) => (
            <li key={cat.name}>
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-foreground">{cat.name}</span>
                <span className="font-mono text-muted-foreground">{formatCurrency(cat.saved)}</span>
              </div>
              <Progress value={cat.pct} className="mt-2 h-2" />
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}
