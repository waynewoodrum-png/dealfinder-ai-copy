import { normalizeZipCode } from "@/lib/restaurant-deals"

export type Coupon = {
  id: string
  merchantName: string
  title: string
  code: string
  description: string
  expiresAt: string
  zipCodes: string[]
  minimumSpend?: number
  featured: boolean
}

export const coupons: Coupon[] = [
  {
    id: "taco-10-off",
    merchantName: "Taco Street Grill",
    title: "$10 off dinner for two",
    code: "TACO10",
    description: "Use on dine-in, pickup, or delivery orders over $30.",
    expiresAt: "2026-12-31",
    zipCodes: ["27601", "27603", "27605"],
    minimumSpend: 30,
    featured: true,
  },
  {
    id: "pizza-date-15",
    merchantName: "Garden Pizza Co.",
    title: "15% off pizza bundles",
    code: "DATE15",
    description: "Good for large pizza bundles and date-night picnic orders.",
    expiresAt: "2026-10-31",
    zipCodes: ["27610", "27601", "27545"],
    minimumSpend: 25,
    featured: false,
  },
  {
    id: "noodle-boba-free",
    merchantName: "Noodle House Express",
    title: "Free boba with two bowls",
    code: "BOBAFREE",
    description: "Redeem when ordering two noodle bowls.",
    expiresAt: "2026-11-30",
    zipCodes: ["27604", "27608", "27609"],
    featured: true,
  },
  {
    id: "local-delivery-5",
    merchantName: "Local delivery",
    title: "$5 off local delivery",
    code: "LOCAL5",
    description: "Delivery campaign placeholder for approved delivery partners.",
    expiresAt: "2026-09-30",
    zipCodes: ["27601", "27603", "27604", "27605", "27610"],
    minimumSpend: 20,
    featured: false,
  },
]

export function findCoupons(merchantName: string, zipCode: string): Coupon[] {
  const normalizedZip = normalizeZipCode(zipCode)
  const merchant = merchantName.trim().toLowerCase()

  return coupons
    .filter((coupon) => coupon.merchantName.toLowerCase() === merchant || coupon.merchantName === "Local delivery")
    .filter((coupon) => !normalizedZip || coupon.zipCodes.includes(normalizedZip))
    .sort((a, b) => Number(b.featured) - Number(a.featured))
}

export function buildCouponRedeemUrl(coupon: Coupon, zipCode: string, wrapperBase = ""): string {
  const normalizedZip = normalizeZipCode(zipCode)
  const query = `${coupon.merchantName} coupon ${coupon.code} ${normalizedZip}`.trim()
  const destination = `https://www.google.com/search?q=${encodeURIComponent(query)}`

  return wrapperBase ? wrapperBase + encodeURIComponent(destination) : destination
}
