export type DealSourceCategory = "grocery" | "retail" | "restaurant" | "delivery" | "apparel" | "electronics" | "home"

export type DealSource = {
  name: string
  category: DealSourceCategory
  searchUrl: string
  sourceType: "official app" | "retailer site" | "affiliate/search" | "future API"
  supportsMultiBuy: boolean
  notes: string
}

export const dealSources: DealSource[] = [
  { name: "Walmart", category: "grocery", searchUrl: "https://www.walmart.com/search?q=%s", sourceType: "retailer site", supportsMultiBuy: true, notes: "Rollbacks, grocery pickup, multi-buy pricing, electronics, apparel, home." },
  { name: "Publix", category: "grocery", searchUrl: "https://www.publix.com/search?query=%s", sourceType: "retailer site", supportsMultiBuy: true, notes: "Weekly BOGO deals, digital coupons, grocery categories." },
  { name: "Kroger", category: "grocery", searchUrl: "https://www.kroger.com/search?query=%s", sourceType: "retailer site", supportsMultiBuy: true, notes: "Loyalty deals, weekly ad, digital coupons." },
  { name: "Aldi", category: "grocery", searchUrl: "https://www.aldi.us/", sourceType: "official app", supportsMultiBuy: false, notes: "Weekly finds and low-cost grocery staples." },
  { name: "Target", category: "retail", searchUrl: "https://www.target.com/s?searchTerm=%s", sourceType: "retailer site", supportsMultiBuy: true, notes: "Target Circle-style deals, household, apparel, grocery." },
  { name: "Best Buy", category: "electronics", searchUrl: "https://www.bestbuy.com/site/searchpage.jsp?st=%s", sourceType: "retailer site", supportsMultiBuy: false, notes: "TVs, appliances, open-box, weekly electronics deals." },
  { name: "Nike", category: "apparel", searchUrl: "https://www.nike.com/w?q=%s", sourceType: "retailer site", supportsMultiBuy: false, notes: "Shoes, apparel, member deals, price drops." },
  { name: "Levi's", category: "apparel", searchUrl: "https://www.levi.com/US/en_US/search?q=%s", sourceType: "retailer site", supportsMultiBuy: false, notes: "Jeans, apparel, seasonal sales." },
  { name: "Home Depot", category: "home", searchUrl: "https://www.homedepot.com/s/%s", sourceType: "retailer site", supportsMultiBuy: true, notes: "Home improvement, appliances, tool bundles." },
  { name: "Lowe's", category: "home", searchUrl: "https://www.lowes.com/search?searchTerm=%s", sourceType: "retailer site", supportsMultiBuy: true, notes: "Home improvement, appliances, bulk savings." },
  { name: "DoorDash", category: "delivery", searchUrl: "https://www.doordash.com/search/store/%s/", sourceType: "affiliate/search", supportsMultiBuy: false, notes: "Restaurant delivery discovery; checkout remains with provider." },
  { name: "Uber Eats", category: "delivery", searchUrl: "https://www.ubereats.com/search?q=%s", sourceType: "affiliate/search", supportsMultiBuy: false, notes: "Restaurant delivery discovery; checkout remains with provider." },
]

export type UniversalDealResult = {
  source: DealSource
  query: string
  offer: string
  estimatedPrice: string
  confidence: "sample" | "live-ready"
}

export const sampleUniversalResults: UniversalDealResult[] = [
  {
    source: dealSources[0],
    query: "chicken breast family pack",
    offer: "Rollback-style grocery price watch",
    estimatedPrice: "Target: under $14",
    confidence: "sample",
  },
  {
    source: dealSources[1],
    query: "cereal",
    offer: "Buy 2 / BOGO style coupon watch",
    estimatedPrice: "Watch weekly ad",
    confidence: "sample",
  },
  {
    source: dealSources[5],
    query: "55 inch 4K TV",
    offer: "Open-box and weekly electronics deal watch",
    estimatedPrice: "Target: under $249",
    confidence: "sample",
  },
  {
    source: dealSources[6],
    query: "running shoes",
    offer: "Brand price-drop alert",
    estimatedPrice: "Target: under $65",
    confidence: "sample",
  },
]

export function buildUniversalSearchUrl(source: DealSource, query: string): string {
  return source.searchUrl.replace("%s", encodeURIComponent(query))
}

export function sourcesByCategory(category: DealSourceCategory | "all"): DealSource[] {
  return category === "all" ? dealSources : dealSources.filter((source) => source.category === category)
}
