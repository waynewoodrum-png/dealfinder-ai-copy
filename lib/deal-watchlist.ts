export type DealWatch = {
  id: string
  item: string
  brand: string
  category: string
  targetPrice: number
  currentPrice: number
  usualPrice: number
  merchant: string
  status: "watching" | "target-hit" | "upcoming" | "rollback"
  upcomingDate?: string
  note: string
}

export const dealWatches: DealWatch[] = [
  {
    id: "tv-55-hisense",
    item: "55-inch 4K smart TV",
    brand: "Hisense",
    category: "Electronics",
    targetPrice: 249,
    currentPrice: 278,
    usualPrice: 349,
    merchant: "Best Buy",
    status: "watching",
    note: "Watch for weekend TV rollback pricing and open-box drops.",
  },
  {
    id: "nike-running-shoes",
    item: "Running shoes",
    brand: "Nike",
    category: "Shoes",
    targetPrice: 65,
    currentPrice: 59,
    usualPrice: 95,
    merchant: "Nike",
    status: "target-hit",
    note: "Target price reached. Good candidate for an alert notification.",
  },
  {
    id: "grocery-chicken",
    item: "Chicken breast family pack",
    brand: "Store brand",
    category: "Groceries",
    targetPrice: 14,
    currentPrice: 17,
    usualPrice: 22,
    merchant: "Walmart Grocery",
    status: "upcoming",
    upcomingDate: "Thursday",
    note: "Upcoming grocery ad cycle. Watch Thursday for weekly sale pricing.",
  },
  {
    id: "home-air-fryer",
    item: "Basket air fryer",
    brand: "Ninja",
    category: "Home",
    targetPrice: 79,
    currentPrice: 79,
    usualPrice: 129,
    merchant: "Home Depot",
    status: "rollback",
    note: "Rollback-style price drop detected from usual price.",
  },
]

export function savingsFromUsual(watch: DealWatch): number {
  return Math.max(0, watch.usualPrice - watch.currentPrice)
}

export function targetGap(watch: DealWatch): number {
  return Math.max(0, watch.currentPrice - watch.targetPrice)
}

export function statusLabel(status: DealWatch["status"]): string {
  switch (status) {
    case "target-hit":
      return "Target hit"
    case "upcoming":
      return "Upcoming"
    case "rollback":
      return "Rollback drop"
    case "watching":
      return "Watching"
  }
}

export function buildWatchSearchUrl(watch: DealWatch): string {
  const query = `${watch.brand} ${watch.item} ${watch.merchant} price drop deal`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}
