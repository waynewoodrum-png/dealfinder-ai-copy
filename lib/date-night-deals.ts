import { normalizeZipCode } from "@/lib/restaurant-deals"

export type DateNightBundle = {
  title: string
  zipCodes: string[]
  dinner: string
  activity: string
  dessert: string
  total: number
  savings: number
  vibe: string
  featured: boolean
}

export type RankedDateNightBundle = DateNightBundle & {
  localMatch: boolean
  valueScore: number
}

export const dateNightBundles: DateNightBundle[] = [
  {
    title: "Downtown Dinner + Indie Movie",
    zipCodes: ["27601", "27603", "27605"],
    dinner: "Taco Street Grill combo for two",
    activity: "Two matinee indie movie tickets",
    dessert: "Shared churro sundae",
    total: 68,
    savings: 24,
    vibe: "casual, fun, walkable",
    featured: true,
  },
  {
    title: "Pizza Picnic + Live Music",
    zipCodes: ["27610", "27601", "27545"],
    dinner: "Garden Pizza Co. large pizza bundle",
    activity: "Free outdoor music night",
    dessert: "Two gelato cups",
    total: 54,
    savings: 31,
    vibe: "relaxed, outdoors, budget win",
    featured: false,
  },
  {
    title: "Noodles + Arcade Challenge",
    zipCodes: ["27604", "27608", "27609"],
    dinner: "Two noodle bowls and shared appetizer",
    activity: "$20 arcade card bundle",
    dessert: "Boba tea two-pack",
    total: 76,
    savings: 19,
    vibe: "playful, casual, high-energy",
    featured: true,
  },
  {
    title: "BBQ Plate + Coffee Walk",
    zipCodes: ["27603", "27529", "27539"],
    dinner: "Shared smokehouse platter",
    activity: "Self-guided mural walk",
    dessert: "Two specialty coffees",
    total: 61,
    savings: 22,
    vibe: "low-key, local, conversation-friendly",
    featured: false,
  },
]

export function buildDateNightSearchUrl(bundleTitle: string, zipCode: string, wrapperBase = ""): string {
  const normalizedZip = normalizeZipCode(zipCode)
  const query = normalizedZip
    ? `${bundleTitle} date night deals near ${normalizedZip}`
    : `${bundleTitle} date night deals near me`
  const destination = `https://www.google.com/search?q=${encodeURIComponent(query)}`

  return wrapperBase ? wrapperBase + encodeURIComponent(destination) : destination
}

export function findDateNightBundles(budget: number, zipCode: string, vibe: string): RankedDateNightBundle[] {
  const normalizedZip = normalizeZipCode(zipCode)
  const vibeFilter = vibe.trim().toLowerCase()

  return dateNightBundles
    .map((bundle) => {
      const localMatch = !!normalizedZip && bundle.zipCodes.includes(normalizedZip)
      return {
        ...bundle,
        localMatch,
        valueScore: bundle.savings + (localMatch ? 30 : 0) + (bundle.featured ? 6 : 0),
      }
    })
    .filter((bundle) => bundle.total <= budget)
    .filter((bundle) => !vibeFilter || vibeFilter === "any" || bundle.vibe.includes(vibeFilter))
    .sort((a, b) => Number(b.localMatch) - Number(a.localMatch) || b.valueScore - a.valueScore)
}
