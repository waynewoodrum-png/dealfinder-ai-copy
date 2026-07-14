import { buildUniversalSearchUrl, dealSources, type DealSourceCategory } from "@/lib/universal-deal-sources"

export type CloseoutDeal = {
  title: string
  category: DealSourceCategory
  sourceName: string
  usualPrice: number
  closeoutPrice: number
  markdownReason: string
  urgency: "today" | "this week" | "last chance" | "seasonal"
  bestFor: string
  query: string
}

export const closeoutDeals: CloseoutDeal[] = [
  {
    title: "Bakery and prepared-food markdowns",
    category: "grocery",
    sourceName: "Publix",
    usualPrice: 18,
    closeoutPrice: 9,
    markdownReason: "End-of-day fresh food markdown",
    urgency: "today",
    bestFor: "quick dinner, lunch, party trays, bakery items",
    query: "bakery prepared food markdowns",
  },
  {
    title: "Family-pack meat closeout",
    category: "grocery",
    sourceName: "Walmart",
    usualPrice: 24,
    closeoutPrice: 15,
    markdownReason: "Weekly ad and manager-special style markdown",
    urgency: "this week",
    bestFor: "meal prep, freezer stocking, family dinners",
    query: "family pack meat markdown",
  },
  {
    title: "Open-box smart TV",
    category: "electronics",
    sourceName: "Best Buy",
    usualPrice: 349,
    closeoutPrice: 249,
    markdownReason: "Open-box or last-model clearance",
    urgency: "last chance",
    bestFor: "TV upgrades, dorm rooms, game rooms",
    query: "open box 55 inch 4K TV clearance",
  },
  {
    title: "Seasonal running shoes",
    category: "apparel",
    sourceName: "Nike",
    usualPrice: 95,
    closeoutPrice: 59,
    markdownReason: "Seasonal colorway closeout",
    urgency: "seasonal",
    bestFor: "running shoes, gym shoes, back-to-school",
    query: "running shoes sale closeout",
  },
  {
    title: "Appliance floor-model closeout",
    category: "home",
    sourceName: "Home Depot",
    usualPrice: 129,
    closeoutPrice: 79,
    markdownReason: "Floor-model or overstock clearance",
    urgency: "last chance",
    bestFor: "kitchen upgrades, gifts, rental homes",
    query: "air fryer clearance closeout",
  },
]

export function closeoutSavings(deal: CloseoutDeal): number {
  return Math.max(0, deal.usualPrice - deal.closeoutPrice)
}

export function closeoutDiscount(deal: CloseoutDeal): number {
  return deal.usualPrice > 0 ? Math.round((closeoutSavings(deal) / deal.usualPrice) * 100) : 0
}

export function buildCloseoutSearchUrl(deal: CloseoutDeal): string {
  const source = dealSources.find((item) => item.name === deal.sourceName)
  if (!source) return `https://www.google.com/search?q=${encodeURIComponent(`${deal.sourceName} ${deal.query}`)}`
  return buildUniversalSearchUrl(source, deal.query)
}
