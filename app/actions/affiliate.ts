"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { affiliateSetting, affiliateClick } from "@/lib/db/schema"
import { desc, eq, sql } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import {
  type AffiliateConfig,
  DEFAULT_AFFILIATE_CONFIG,
  buildAffiliateUrl,
  estimateCommission,
} from "@/lib/affiliate"

const GLOBAL_ID = "global"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

/** Read the single global affiliate config, creating the default row if missing. */
export async function getAffiliateConfig(): Promise<AffiliateConfig> {
  const rows = await db
    .select()
    .from(affiliateSetting)
    .where(eq(affiliateSetting.id, GLOBAL_ID))
    .limit(1)

  if (rows.length === 0) return { ...DEFAULT_AFFILIATE_CONFIG }

  const r = rows[0]
  return {
    amazonTag: r.amazonTag,
    linkWrapperBase: r.linkWrapperBase,
    commissionRate: Number(r.commissionRate),
    enabled: r.enabled,
  }
}

export async function saveAffiliateSettings(input: {
  amazonTag: string
  linkWrapperBase: string
  commissionRate: number
  enabled: boolean
}) {
  await getUserId() // require auth

  const values = {
    amazonTag: input.amazonTag.trim(),
    linkWrapperBase: input.linkWrapperBase.trim(),
    commissionRate: Math.min(1, Math.max(0, input.commissionRate)).toFixed(4),
    enabled: input.enabled,
    updatedAt: new Date(),
  }

  await db
    .insert(affiliateSetting)
    .values({ id: GLOBAL_ID, ...values })
    .onConflictDoUpdate({ target: affiliateSetting.id, set: values })

  revalidatePath("/dashboard/affiliate")
  revalidatePath("/dashboard")
}

/**
 * Record an outbound affiliate click and return the destination URL so the
 * client can open it. Scoped by the clicking user for attribution.
 */
export async function recordAffiliateClick(input: {
  source: "deal" | "shopping"
  label: string
  merchant: string
  query: string
  price: number
}): Promise<{ url: string }> {
  const userId = await getUserId()
  const config = await getAffiliateConfig()
  const url = buildAffiliateUrl(input.merchant, input.query || input.label, config)
  const est = estimateCommission(input.price, config)

  await db.insert(affiliateClick).values({
    userId,
    source: input.source,
    label: input.label,
    merchant: input.merchant,
    url,
    price: input.price.toFixed(2),
    estCommission: est.toFixed(2),
  })

  revalidatePath("/dashboard/affiliate")
  return { url }
}

export type AffiliateStats = {
  totalClicks: number
  estEarnings: number
  topMerchants: { merchant: string; clicks: number; est: number }[]
  recent: {
    id: number
    source: string
    label: string
    merchant: string
    price: number
    est: number
    createdAt: string
  }[]
}

/**
 * App-wide affiliate performance — this is the owner's revenue view, so it
 * aggregates clicks across all shoppers (the owner earns from every purchase).
 */
export async function getAffiliateStats(): Promise<AffiliateStats> {
  await getUserId() // require auth

  const totals = await db
    .select({
      clicks: sql<number>`count(*)::int`,
      est: sql<string>`coalesce(sum(${affiliateClick.estCommission}), 0)`,
    })
    .from(affiliateClick)

  const byMerchant = await db
    .select({
      merchant: affiliateClick.merchant,
      clicks: sql<number>`count(*)::int`,
      est: sql<string>`coalesce(sum(${affiliateClick.estCommission}), 0)`,
    })
    .from(affiliateClick)
    .groupBy(affiliateClick.merchant)
    .orderBy(desc(sql`count(*)`))
    .limit(6)

  const recentRows = await db
    .select()
    .from(affiliateClick)
    .orderBy(desc(affiliateClick.createdAt))
    .limit(12)

  return {
    totalClicks: totals[0]?.clicks ?? 0,
    estEarnings: Number(totals[0]?.est ?? 0),
    topMerchants: byMerchant.map((m) => ({
      merchant: m.merchant,
      clicks: m.clicks,
      est: Number(m.est),
    })),
    recent: recentRows.map((r) => ({
      id: r.id,
      source: r.source,
      label: r.label,
      merchant: r.merchant,
      price: Number(r.price),
      est: Number(r.estCommission),
      createdAt: r.createdAt.toISOString(),
    })),
  }
}
