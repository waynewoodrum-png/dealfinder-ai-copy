import { normalizeZipCode } from "@/lib/restaurant-deals"

export type DeliveryService = "DoorDash" | "Uber Eats" | "Local delivery"

export type DeliveryLink = {
  service: DeliveryService
  href: string
}

const deliverySearchTemplates: Record<DeliveryService, string> = {
  DoorDash: "https://www.doordash.com/search/store/%s/",
  "Uber Eats": "https://www.ubereats.com/search?q=%s",
  "Local delivery": "https://www.google.com/search?q=%s",
}

function buildSearchQuery(restaurantName: string, zipCode: string): string {
  const normalizedZip = normalizeZipCode(zipCode)
  return normalizedZip ? `${restaurantName} delivery near ${normalizedZip}` : `${restaurantName} delivery near me`
}

function wrapLink(destination: string, wrapperBase: string): string {
  return wrapperBase ? wrapperBase + encodeURIComponent(destination) : destination
}

export function buildDeliveryLinks(restaurantName: string, zipCode: string, wrapperBase = ""): DeliveryLink[] {
  const query = encodeURIComponent(buildSearchQuery(restaurantName, zipCode))

  return (Object.keys(deliverySearchTemplates) as DeliveryService[]).map((service) => ({
    service,
    href: wrapLink(deliverySearchTemplates[service].replace("%s", query), wrapperBase),
  }))
}
