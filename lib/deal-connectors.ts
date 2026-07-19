import type { DealSource } from "@/lib/universal-deal-sources"

export type ConnectorMode = "fallback-search" | "affiliate-feed" | "official-api" | "manual-feed"

export type DealConnector = {
  sourceName: string
  mode: ConnectorMode
  envKeys: string[]
  status: "ready-now" | "credentials-needed" | "partner-needed"
  useCase: string
}

export const dealConnectors: DealConnector[] = [
  {
    sourceName: "Walmart",
    mode: "affiliate-feed",
    envKeys: ["WALMART_AFFILIATE_ID", "WALMART_FEED_URL"],
    status: "credentials-needed",
    useCase: "Product prices, rollbacks, grocery pickup links, multi-buy deals.",
  },
  {
    sourceName: "Publix",
    mode: "manual-feed",
    envKeys: ["PUBLIX_WEEKLY_AD_FEED_URL"],
    status: "partner-needed",
    useCase: "Weekly ad, BOGO deals, digital coupons by zip or store.",
  },
  {
    sourceName: "Kroger",
    mode: "official-api",
    envKeys: ["KROGER_CLIENT_ID", "KROGER_CLIENT_SECRET"],
    status: "credentials-needed",
    useCase: "Product search, store location, loyalty-style grocery deals.",
  },
  {
    sourceName: "Target",
    mode: "affiliate-feed",
    envKeys: ["TARGET_AFFILIATE_ID", "TARGET_FEED_URL"],
    status: "credentials-needed",
    useCase: "Retail, grocery, household, apparel, and circle-style promotions.",
  },
  {
    sourceName: "Best Buy",
    mode: "official-api",
    envKeys: ["BESTBUY_API_KEY"],
    status: "credentials-needed",
    useCase: "Electronics price search, TV deals, open-box style matching.",
  },
  {
    sourceName: "DoorDash",
    mode: "affiliate-feed",
    envKeys: ["DOORDASH_PARTNER_ID"],
    status: "partner-needed",
    useCase: "Restaurant delivery links and sponsored delivery campaigns.",
  },
  {
    sourceName: "Uber Eats",
    mode: "affiliate-feed",
    envKeys: ["UBEREATS_PARTNER_ID"],
    status: "partner-needed",
    useCase: "Restaurant delivery links and sponsored delivery campaigns.",
  },
]

export function connectorFor(source: DealSource): DealConnector {
  return (
    dealConnectors.find((connector) => connector.sourceName === source.name) ?? {
      sourceName: source.name,
      mode: "fallback-search",
      envKeys: [],
      status: "ready-now",
      useCase: "Fallback search link until an official API or affiliate feed is available.",
    }
  )
}

export function connectorStatusLabel(status: DealConnector["status"]): string {
  switch (status) {
    case "ready-now":
      return "Search ready"
    case "credentials-needed":
      return "Needs credentials"
    case "partner-needed":
      return "Needs partner access"
  }
}
