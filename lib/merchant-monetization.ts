export type MerchantPackage = {
  name: string
  price: string
  bestFor: string
  features: string[]
  cta: string
}

export const merchantPackages: MerchantPackage[] = [
  {
    name: "Featured Zip Starter",
    price: "$49/mo",
    bestFor: "One local restaurant testing demand",
    features: ["Featured in 1 zip code", "One active coupon", "Pickup and delivery links", "Basic campaign tracking"],
    cta: "Start in one zip",
  },
  {
    name: "Local Growth",
    price: "$149/mo",
    bestFor: "Restaurants that want steady local traffic",
    features: ["Featured in up to 3 zip codes", "Three active coupons", "Date-night bundle placement", "Weekly performance summary"],
    cta: "Grow local reach",
  },
  {
    name: "Market Sponsor",
    price: "$399/mo",
    bestFor: "Brands, delivery services, and multi-location operators",
    features: ["Sponsored category placement", "Unlimited coupon campaigns", "Growth-engine campaign links", "Priority bundle placement"],
    cta: "Sponsor a market",
  },
]

export type MerchantCampaignDraft = {
  merchantName: string
  zipCodes: string
  couponCode: string
  offer: string
  monthlyBudget: string
}

export const sampleMerchantCampaign: MerchantCampaignDraft = {
  merchantName: "Taco Street Grill",
  zipCodes: "27601, 27603",
  couponCode: "TACO10",
  offer: "$10 off dinner for two over $30",
  monthlyBudget: "$149/mo",
}
