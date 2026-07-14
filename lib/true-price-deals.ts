import { coupons, type Coupon } from "@/lib/coupons"
import { restaurantDeals, normalizeZipCode, type RestaurantDeal } from "@/lib/restaurant-deals"

export type FulfillmentMode = "pickup" | "delivery"

export type TruePriceDeal = {
  restaurant: RestaurantDeal
  mode: FulfillmentMode
  subtotal: number
  coupon?: Coupon
  couponSavings: number
  tax: number
  serviceFee: number
  deliveryFee: number
  tip: number
  finalTotal: number
  budgetLeft: number
  localMatch: boolean
  reason: string
}

const TAX_RATE = 0.075
const DELIVERY_SERVICE_FEE_RATE = 0.12
const DELIVERY_FEE = 4.99
const TIP_RATE = 0.15

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

function priceDeal(restaurant: RestaurantDeal, zipCode: string, partySize: number, mode: FulfillmentMode, budget: number): TruePriceDeal {
  const safePartySize = Math.max(1, partySize)
  const subtotal = roundMoney((restaurant.priceForTwo / 2) * safePartySize)
  const coupon = bestCouponFor(restaurant.name, zipCode, subtotal, mode)
  const savings = couponSavings(coupon, subtotal)
  const discountedSubtotal = Math.max(0, subtotal - savings)
  const tax = roundMoney(discountedSubtotal * TAX_RATE)
  const serviceFee = mode === "delivery" ? roundMoney(discountedSubtotal * DELIVERY_SERVICE_FEE_RATE) : 0
  const deliveryFee = mode === "delivery" ? DELIVERY_FEE : 0
  const tip = mode === "delivery" ? roundMoney(discountedSubtotal * TIP_RATE) : 0
  const finalTotal = roundMoney(discountedSubtotal + tax + serviceFee + deliveryFee + tip)
  const normalizedZip = normalizeZipCode(zipCode)
  const localMatch = !!normalizedZip && restaurant.zipCodes.includes(normalizedZip)

  return {
    restaurant,
    mode,
    subtotal,
    coupon,
    couponSavings: savings,
    tax,
    serviceFee,
    deliveryFee,
    tip,
    finalTotal,
    budgetLeft: roundMoney(budget - finalTotal),
    localMatch,
    reason: mode === "pickup" ? "Lowest fees: no delivery, service fee, or tip." : "Convenience option: includes estimated delivery fees and tip.",
  }
}

export function findTruePriceDeals(budget: number, zipCode: string, partySize: number, preferredMode: FulfillmentMode | "best"): TruePriceDeal[] {
  const modes: FulfillmentMode[] = preferredMode === "best" ? ["pickup", "delivery"] : [preferredMode]

  return restaurantDeals
    .flatMap((restaurant) => modes.map((mode) => priceDeal(restaurant, zipCode, partySize, mode, budget)))
    .filter((deal) => deal.finalTotal <= budget)
    .sort((a, b) => Number(b.localMatch) - Number(a.localMatch) || a.finalTotal - b.finalTotal)
}
