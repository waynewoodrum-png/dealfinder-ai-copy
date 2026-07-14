export type GrowthCampaign = {
  title: string
  channel: string
  prompt: string
  cta: string
  utmSource: string
}

export const growthCampaigns: GrowthCampaign[] = [
  {
    title: "Dinner under $50 Reel",
    channel: "TikTok / Reels",
    prompt: "I asked DealFinder AI to find dinner for 2 near 27601 under $50. Here are the best matches.",
    cta: "Try your zip code",
    utmSource: "social_video",
  },
  {
    title: "Local Facebook group post",
    channel: "Facebook Groups",
    prompt: "Drop your zip code and budget. DealFinder shows restaurant deals, coupons, and delivery links nearby.",
    cta: "Find local deals",
    utmSource: "facebook_groups",
  },
  {
    title: "Restaurant owner pitch",
    channel: "Merchant outreach",
    prompt:
      "We feature restaurants by zip code when people ask for budget-friendly meals. Want your coupon or dinner bundle listed?",
    cta: "Get featured",
    utmSource: "merchant_outreach",
  },
]

export function buildCampaignUrl(path = "/", source: string, campaign: string): string {
  const params = new URLSearchParams({
    utm_source: source,
    utm_medium: "growth_engine",
    utm_campaign: campaign.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""),
  })

  return `${path}?${params.toString()}`
}

export function buildShareText(zipCode: string, budget: number): string {
  return `I found AI-powered local deals near ${zipCode} under $${budget}. Try DealFinder AI and see what it finds in your zip code.`
}

export const merchantOutreachTemplate = `Hi {{merchantName}},

I’m building DealFinder AI, a local deal finder that helps customers search by zip code and budget, like “feed 2 people near 27601 for $50.”

We can feature your restaurant with a coupon, pickup link, delivery link, or date-night bundle in your local zip codes.

Would you like to test a featured deal placement for your restaurant this month?

Thanks,
DealFinder AI`
