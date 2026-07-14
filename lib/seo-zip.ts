import { dateNightBundles, findDateNightBundles } from "@/lib/date-night-deals"
import { findRestaurantDeals, normalizeZipCode, restaurantDeals } from "@/lib/restaurant-deals"

export const featuredZipCodes = ["27601", "27603", "27604", "27605", "27610"]

export function getZipLabel(zipCode: string): string {
  return normalizeZipCode(zipCode) || "your zip code"
}

export function getSeoRestaurantDeals(zipCode: string) {
  return findRestaurantDeals(50, "Any", 2, zipCode).slice(0, 5)
}

export function getSeoDateNightDeals(zipCode: string) {
  return findDateNightBundles(80, zipCode, "Any").slice(0, 5)
}

export function hasDealsForZip(zipCode: string): boolean {
  const normalizedZip = normalizeZipCode(zipCode)
  return (
    restaurantDeals.some((deal) => deal.zipCodes.includes(normalizedZip)) ||
    dateNightBundles.some((bundle) => bundle.zipCodes.includes(normalizedZip))
  )
}
