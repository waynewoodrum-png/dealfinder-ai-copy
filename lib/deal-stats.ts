import type { DealRow } from "@/app/actions/deals"

export type DealView = {
  id: number
  title: string
  merchant: string
  category: string
  originalPrice: number
  dealPrice: number
  savings: number
  discountPct: number
  status: string
  createdAt: Date
}

export function toDealView(row: DealRow): DealView {
  const originalPrice = Number(row.originalPrice)
  const dealPrice = Number(row.dealPrice)
  const savings = Math.max(originalPrice - dealPrice, 0)
  const discountPct = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0
  return {
    id: row.id,
    title: row.title,
    merchant: row.merchant,
    category: row.category,
    originalPrice,
    dealPrice,
    savings,
    discountPct,
    status: row.status,
    createdAt: new Date(row.createdAt),
  }
}

export type DealStats = {
  totalSaved: number
  claimedSaved: number
  potentialSaved: number
  activeCount: number
  claimedCount: number
  avgDiscount: number
  streakWeeks: number
  categories: { name: string; saved: number; pct: number }[]
}

export function computeStats(deals: DealView[]): DealStats {
  const claimed = deals.filter((d) => d.status === "claimed")
  const active = deals.filter((d) => d.status === "active")

  const claimedSaved = claimed.reduce((sum, d) => sum + d.savings, 0)
  const potentialSaved = active.reduce((sum, d) => sum + d.savings, 0)
  const totalSaved = claimedSaved

  const avgDiscount = deals.length > 0 ? Math.round(deals.reduce((s, d) => s + d.discountPct, 0) / deals.length) : 0

  // Category breakdown based on claimed savings.
  const byCategory = new Map<string, number>()
  for (const d of claimed) {
    byCategory.set(d.category, (byCategory.get(d.category) ?? 0) + d.savings)
  }
  const maxCat = Math.max(1, ...Array.from(byCategory.values()))
  const categories = Array.from(byCategory.entries())
    .map(([name, saved]) => ({ name, saved, pct: Math.round((saved / maxCat) * 100) }))
    .sort((a, b) => b.saved - a.saved)

  // Streak: consecutive weeks (including current) with at least one claimed deal.
  const streakWeeks = computeStreak(claimed.map((d) => d.createdAt))

  return {
    totalSaved,
    claimedSaved,
    potentialSaved,
    activeCount: active.length,
    claimedCount: claimed.length,
    avgDiscount,
    streakWeeks,
    categories,
  }
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

function startOfWeek(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - day)
  return d.getTime()
}

function computeStreak(dates: Date[]): number {
  if (dates.length === 0) return 0
  const weeks = new Set(dates.map((d) => startOfWeek(d)))
  let streak = 0
  let cursor = startOfWeek(new Date())
  // Allow the streak to start this week or last week.
  if (!weeks.has(cursor)) {
    cursor -= WEEK_MS
    if (!weeks.has(cursor)) return 0
  }
  while (weeks.has(cursor)) {
    streak += 1
    cursor -= WEEK_MS
  }
  return streak
}

export function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 })
}
