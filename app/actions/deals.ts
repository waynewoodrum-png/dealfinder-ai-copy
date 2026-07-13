"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { deal, coinTransaction } from "@/lib/db/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { syncStreakCoins } from "@/app/actions/coins"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type DealRow = typeof deal.$inferSelect

export async function getDeals(): Promise<DealRow[]> {
  const userId = await getUserId()
  return db.select().from(deal).where(eq(deal.userId, userId)).orderBy(desc(deal.createdAt))
}

export async function addDeal(input: {
  title: string
  merchant: string
  category: string
  originalPrice: number
  dealPrice: number
}) {
  const userId = await getUserId()
  await db.insert(deal).values({
    userId,
    title: input.title,
    merchant: input.merchant,
    category: input.category || "Other",
    originalPrice: input.originalPrice.toFixed(2),
    dealPrice: input.dealPrice.toFixed(2),
    status: "active",
  })
  revalidatePath("/dashboard")
}

export async function updateDealStatus(id: number, status: "active" | "claimed" | "expired") {
  const userId = await getUserId()
  await db
    .update(deal)
    .set({ status })
    .where(and(eq(deal.id, id), eq(deal.userId, userId)))
  await syncStreakCoins(userId)
  revalidatePath("/dashboard")
}

export async function deleteDeal(id: number) {
  const userId = await getUserId()
  await db.delete(deal).where(and(eq(deal.id, id), eq(deal.userId, userId)))
  revalidatePath("/dashboard")
}

const SEED_DEALS = [
  { title: "Sony WH-1000XM5 Headphones", merchant: "Amazon", category: "Electronics", originalPrice: 399.99, dealPrice: 279.99, status: "active" },
  { title: "Levi's 501 Original Jeans", merchant: "Levi's", category: "Fashion", originalPrice: 69.5, dealPrice: 39.99, status: "claimed" },
  { title: "Instant Pot Duo 6qt", merchant: "Target", category: "Home", originalPrice: 119.99, dealPrice: 79.99, status: "active" },
  { title: "Nike Pegasus 41", merchant: "Nike", category: "Fashion", originalPrice: 140.0, dealPrice: 98.0, status: "active" },
  { title: "Annual Streaming Bundle", merchant: "StreamCo", category: "Subscriptions", originalPrice: 179.88, dealPrice: 119.88, status: "claimed" },
  { title: "Dyson V8 Vacuum", merchant: "Best Buy", category: "Home", originalPrice: 469.99, dealPrice: 349.99, status: "active" },
]

export async function seedDeals() {
  const userId = await getUserId()
  const existing = await db.select({ id: deal.id }).from(deal).where(eq(deal.userId, userId)).limit(1)
  if (existing.length > 0) return
  await db.insert(deal).values(
    SEED_DEALS.map((d) => ({
      userId,
      title: d.title,
      merchant: d.merchant,
      category: d.category,
      originalPrice: d.originalPrice.toFixed(2),
      dealPrice: d.dealPrice.toFixed(2),
      status: d.status,
    })),
  )
  await syncStreakCoins(userId)
  revalidatePath("/dashboard")
}
