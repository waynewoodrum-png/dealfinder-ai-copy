export const COINS_PER_DOLLAR = 10

// Coins granted for each week that contains at least one claimed deal.
export const COINS_PER_SAVING_WEEK = 10

// Bonus coins granted when the current streak reaches a milestone length (in weeks).
export const STREAK_MILESTONES: { weeks: number; bonus: number }[] = [
  { weeks: 2, bonus: 20 },
  { weeks: 4, bonus: 50 },
  { weeks: 8, bonus: 120 },
  { weeks: 12, bonus: 200 },
]

// Preset redemption tiers (dollars off).
export const REDEEM_TIERS = [5, 10, 25]

const WEEK_MS = 7 * 24 * 60 * 60 * 1000

export function coinsToDollars(coins: number): number {
  return coins / COINS_PER_DOLLAR
}

export function dollarsToCoins(dollars: number): number {
  return Math.round(dollars * COINS_PER_DOLLAR)
}

export function startOfWeek(date: Date): number {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  const day = (d.getDay() + 6) % 7 // Monday = 0
  d.setDate(d.getDate() - day)
  return d.getTime()
}

export type CoinAward = {
  refKey: string
  coins: number
  reason: string
}

/**
 * Given the dates of a user's claimed deals, compute the full set of coin
 * awards they are entitled to. Every award has a stable refKey so inserting
 * them repeatedly (ON CONFLICT DO NOTHING) is idempotent and never
 * double-counts.
 */
export function computeStreakAwards(claimedDates: Date[]): CoinAward[] {
  if (claimedDates.length === 0) return []

  const savingWeeks = new Set(claimedDates.map((d) => startOfWeek(d)))
  const awards: CoinAward[] = []

  // 1. One award per week that the shopper saved.
  for (const weekMs of savingWeeks) {
    awards.push({
      refKey: `week:${weekMs}`,
      coins: COINS_PER_SAVING_WEEK,
      reason: "Saved this week",
    })
  }

  // 2. Milestone bonuses tied to the current streak's start week, so a fresh
  //    streak that later reaches the same milestone earns the bonus again.
  const { length, startWeekMs } = currentStreak(savingWeeks)
  for (const { weeks, bonus } of STREAK_MILESTONES) {
    if (length >= weeks) {
      awards.push({
        refKey: `milestone:${startWeekMs}:${weeks}`,
        coins: bonus,
        reason: `${weeks}-week savings streak bonus`,
      })
    }
  }

  return awards
}

function currentStreak(savingWeeks: Set<number>): { length: number; startWeekMs: number } {
  let cursor = startOfWeek(new Date())
  // Streak may start this week or last week.
  if (!savingWeeks.has(cursor)) {
    cursor -= WEEK_MS
    if (!savingWeeks.has(cursor)) return { length: 0, startWeekMs: cursor }
  }
  let length = 0
  let startWeekMs = cursor
  while (savingWeeks.has(cursor)) {
    length += 1
    startWeekMs = cursor
    cursor -= WEEK_MS
  }
  return { length, startWeekMs }
}

export function formatCoins(coins: number): string {
  return coins.toLocaleString("en-US")
}
