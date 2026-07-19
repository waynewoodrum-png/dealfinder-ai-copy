// Affiliate link building + commission projection helpers.
// No external integration required — Amazon Associates works out of the box
// via the tag param; other retailers can be routed through an optional
// link-wrapper base (Skimlinks / Sovrn / Rakuten deep link, etc.).

export type AffiliateConfig = {
  amazonTag: string
  linkWrapperBase: string
  commissionRate: number
  enabled: boolean
}

export const DEFAULT_AFFILIATE_CONFIG: AffiliateConfig = {
  amazonTag: "",
  linkWrapperBase: "",
  commissionRate: 0.03,
  enabled: true,
}

// Known retailers → a search URL template. `%s` is replaced by the query.
const RETAILER_SEARCH: Record<string, string> = {
  amazon: "https://www.amazon.com/s?k=%s",
  target: "https://www.target.com/s?searchTerm=%s",
  walmart: "https://www.walmart.com/search?q=%s",
  "lowe's": "https://www.lowes.com/search?searchTerm=%s",
  lowes: "https://www.lowes.com/search?searchTerm=%s",
  "home depot": "https://www.homedepot.com/s/%s",
  homedepot: "https://www.homedepot.com/s/%s",
  "best buy": "https://www.bestbuy.com/site/searchpage.jsp?st=%s",
  bestbuy: "https://www.bestbuy.com/site/searchpage.jsp?st=%s",
  nike: "https://www.nike.com/w?q=%s",
  "levi's": "https://www.levi.com/US/en_US/search?q=%s",
  levis: "https://www.levi.com/US/en_US/search?q=%s",
  kroger: "https://www.kroger.com/search?query=%s",
  aldi: "https://www.aldi.us/",
  costco: "https://www.costco.com/CatalogSearch?keyword=%s",
  "trader joe's": "https://www.traderjoes.com/home/search?q=%s",
  "whole foods": "https://www.amazon.com/s?k=%s",
  safeway: "https://www.safeway.com/shop/search-results.html?q=%s",
  publix: "https://www.publix.com/search?query=%s",
}

function normalize(merchant: string): string {
  return merchant.trim().toLowerCase()
}

function retailerSearchUrl(merchant: string, query: string): string {
  const key = normalize(merchant)
  const template = RETAILER_SEARCH[key]
  const q = encodeURIComponent(query)
  if (template) {
    return template.includes("%s") ? template.replace("%s", q) : template
  }
  // Fallback: Google Shopping search still surfaces the item and is trackable.
  return `https://www.google.com/search?tbm=shop&q=${q}`
}

/**
 * Build the outbound affiliate URL for a merchant + product query.
 * - Amazon (and Whole Foods) get the Associates `tag` appended when configured.
 * - Any URL is wrapped by `linkWrapperBase` when configured (network deep link).
 */
export function buildAffiliateUrl(
  merchant: string,
  query: string,
  config: AffiliateConfig,
): string {
  let url = retailerSearchUrl(merchant, query)
  const key = normalize(merchant)
  const isAmazon = key === "amazon" || key === "whole foods"

  if (isAmazon && config.amazonTag) {
    url += (url.includes("?") ? "&" : "?") + `tag=${encodeURIComponent(config.amazonTag)}`
  }

  if (config.linkWrapperBase) {
    return config.linkWrapperBase + encodeURIComponent(url)
  }

  return url
}

/** Estimated commission a purchase at this price would generate. */
export function estimateCommission(price: number, config: AffiliateConfig): number {
  if (!price || price <= 0) return 0
  return Math.round(price * config.commissionRate * 100) / 100
}

export function formatMoney(n: number): string {
  return `$${n.toFixed(2)}`
}

export function formatRate(rate: number): string {
  return `${(rate * 100).toFixed(1)}%`
}
