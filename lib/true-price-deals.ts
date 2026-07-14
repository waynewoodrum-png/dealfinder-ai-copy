import { coupons, type Coupon } from "@/lib/coupons"
import { restaurantDeals, normalizeZipCode, type RestaurantDeal } from "@/lib/restaurant-deals"

export type FulfillmentMode = "pickup" | "delivery"

export type BestDealMatch = {
  restaurant: RestaurantDeal
  mode: FulfillmentMode
  estimatedMenuTotal: number
  coupon?: Coupon
  couponSavings: number
  estimatedDealTotal: number
  budgetLeft: number
  localMatch: boolean
  dealScore: number
  reason: string
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

function couponSavings(coupon: Coupon | undefined, subtotal: number): number {
  if (!coupon) return 0
  if (coupon.minimumSpend && subtotal < coupon.minimumSpend) return 0
  if (coupon.code === "DATE15") return roundMoney(subtotal * 0.15)
  if (coupon.code === "LOCAL5") return 5
  if (coupon.code === "TACO10") return 10
  return 0
}

function bestCouponFor(restaurantName: string, zipCode: string, subtotal: number, mode: FulfillmentMode): Coupon | undefined {
  const normalizedZip = normalizeZipCode(zipCode)
  const merchant = restaurantName.toLowerCase()

  return coupons
    .filter((coupon) => coupon.merchantName.toLowerCase() === merchant || (mode === "delivery" && coupon.merchantName === "Local delivery"))
    .filter((coupon) => !normalizedZip || coupon.zipCodes.includes(normalizedZip))
    .filter((coupon) => couponSavings(coupon, subtotal) > 0)
    .sort((a, b) => couponSavings(b, subtotal) - couponSavings(a, subtotal))[0]
}

function scoreDeal(restaurant: RestaurantDeal, zipCode: string, partySize: number, mode: FulfillmentMode, budget: number): BestDealMatch {
  const safePartySize = Math.max(1, partySize)
  const estimatedMenuTotal = roundMoney((restaurant.priceForTwo / 2) * safePartySize)
  const coupon = bestCouponFor(restaurant.name, zipCode, estimatedMenuTotal, mode)
  const savings = couponSavings(coupon, estimatedMenuTotal)
  const estimatedDealTotal = roundMoney(Math.max(0, estimatedMenuTotal - savings))
  const normalizedZip = normalizeZipCode(zipCode)
  const localMatch = !!normalizedZip && restaurant.zipCodes.includes(normalizedZip)
  const budgetLeft = roundMoney(budget - estimatedDealTotal)

  return {
    restaurant,
    mode,
    estimatedMenuTotal,
    coupon,
    couponSavings: savings,
    estimatedDealTotal,
    budgetLeft,
    localMatch,
    dealScore: Math.max(0, budgetLeft) + savings + (localMatch ? 25 : 0) + (restaurant.featured ? 5 : 0),
    reason:
      mode === "pickup"
        ? "Pickup keeps the order simple and sends users to the restaurant."
        : "Delivery opens the provider so your app stays focused on referrals.",
  }
}

export function findBestDealMatches(
  budget: number,
  zipCode: string,
  partySize: number,
  preferredMode: FulfillmentMode | "best",
): BestDealMatch[] {
  const modes: FulfillmentMode[] = preferredMode === "best" ? ["pickup", "delivery"] : [preferredMode]

  return restaurantDeals
    .flatMap((restaurant) => modes.map((mode) => scoreDeal(restaurant, zipCode, partySize, mode, budget)))
    .filter((deal) => deal.estimatedDealTotal <= budget)
    .sort((a, b) => Number(b.localMatch) - Number(a.localMatch) || b.dealScore - a.dealScore)
}
