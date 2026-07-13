"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { coinTransaction, deal } from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { computeStreakAwards, coinsToDollars, dollarsToCoins, COINS_PER_DOLLAR } from "@/lib/coins"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type CoinTxn = typeof coinTransaction.$inferSelect

export type CoinSummary = {
  balance: number
  lifetimeEarned: number
  redeemedDollars: number
  availableDollars: number
  perDollar: number
  transactions: {
    id: number
    type: string
    coins: number
    dollars: number
    reason: string
    createdAt: string
  }[]
}

/**
 * Idempotently grant streak coins for the given user based on their claimed
 * deals. Safe to call after any deal mutation — the unique (userId, refKey)
 * index prevents double-awarding.
 */
export async function syncStreakCoins(userId: string): Promise<void> {
  const claimed = await db
    .select({ createdAt: deal.createdAt })
    .from(deal)
    .where(and(eq(deal.userId, userId), eq(deal.status, "claimed")))

  const awards = computeStreakAwards(claimed.map((c) => new Date(c.createdAt)))
  if (awards.length === 0) return

  await db
    .insert(coinTransaction)
    .values(
      awards.map((a) => ({
        userId,
        type: "earn",
        coins: a.coins,
        dollars: "0",
        reason: a.reason,
        refKey: a.refKey,
      })),
    )
    .onConflictDoNothing()
}

export async function getCoinSummary(): Promise<CoinSummary> {
  const userId = await getUserId()
  // Make sure any newly-earned streak coins are reflected.
  await syncStreakCoins(userId)

  const rows = await db
    .select()
    .from(coinTransaction)
    .where(eq(coinTransaction.userId, userId))
    .orderBy(desc(coinTransaction.createdAt))

  let lifetimeEarned = 0
  let redeemedCoins = 0
  let redeemedDollars = 0
  for (const r of rows) {
    if (r.type === "earn") lifetimeEarned += r.coins
    else {
      redeemedCoins += r.coins
      redeemedDollars += Number(r.dollars)
    }
  }
  const balance = lifetimeEarned - redeemedCoins

  return {
    balance,
    lifetimeEarned,
    redeemedDollars,
    availableDollars: redeemedDollars,
    perDollar: COINS_PER_DOLLAR,
    transactions: rows.map((r) => ({
      id: r.id,
      type: r.type,
      coins: r.coins,
      dollars: Number(r.dollars),
      reason: r.reason,
      createdAt: new Date(r.createdAt).toISOString(),
    })),
  }
}

export type RedeemResult = { ok: true; dollars: number; coins: number } | { ok: false; error: string }

export async function redeemCoins(dollars: number): Promise<RedeemResult> {
  const userId = await getUserId()

  if (!Number.isFinite(dollars) || dollars <= 0) {
    return { ok: false, error: "Enter an amount greater than $0." }
  }
  // Whole-dollar redemptions keep the coin math clean.
  const roundedDollars = Math.floor(dollars)
  if (roundedDollars < 1) {
    return { ok: false, error: "Minimum redemption is $1." }
  }
  const cost = dollarsToCoins(roundedDollars)

  // Recompute balance server-side; never trust the client.
  const [totals] = await db
    .select({
      earned: sql<number>`coalesce(sum(case when ${coinTransaction.type} = 'earn' then ${coinTransaction.coins} else 0 end), 0)`,
      redeemed: sql<number>`coalesce(sum(case when ${coinTransaction.type} = 'redeem' then ${coinTransaction.coins} else 0 end), 0)`,
    })
    .from(coinTransaction)
    .where(eq(coinTransaction.userId, userId))

  const balance = Number(totals?.earned ?? 0) - Number(totals?.redeemed ?? 0)
  if (cost > balance) {
    return { ok: false, error: `You need ${cost} coins for $${roundedDollars}, but only have ${balance}.` }
  }

  await db.insert(coinTransaction).values({
    userId,
    type: "redeem",
    coins: cost,
    dollars: roundedDollars.toFixed(2),
    reason: `Redeemed $${roundedDollars} off your next purchase`,
    refKey: null,
  })

  revalidatePath("/dashboard/rewards")
  revalidatePath("/dashboard")
  return { ok: true, dollars: roundedDollars, coins: cost }
}

// Re-exported for display components.
export { coinsToDollars }
