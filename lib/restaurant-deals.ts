export type RestaurantDeal = {
  name: string
  cuisine: string
  neighborhood: string
  priceForTwo: number
  deal: string
  bestOrder: string
  featured: boolean
  zipCodes: string[]
}

export type RankedRestaurantDeal = RestaurantDeal & {
  localMatch: boolean
  estimatedForParty: number
  savingsScore: number
}

export const restaurantDeals: RestaurantDeal[] = [
  {
    name: "Taco Street Grill",
    cuisine: "Mexican",
    neighborhood: "Downtown",
    priceForTwo: 32,
    deal: "2 entree combo + chips under budget",
    bestOrder: "Two burrito bowls, chips, and fountain drinks",
    featured: true,
    zipCodes: ["27601", "27603", "27605"],
  },
  {
    name: "Noodle House Express",
    cuisine: "Asian",
    neighborhood: "Midtown",
    priceForTwo: 38,
    deal: "Lunch and early dinner specials",
    bestOrder: "Two noodle bowls and one shared appetizer",
    featured: false,
    zipCodes: ["27604", "27608", "27609"],
  },
  {
    name: "Burger Barn",
    cuisine: "American",
    neighborhood: "Westside",
    priceForTwo: 44,
    deal: "Family bundle beats ordering separately",
    bestOrder: "Two burgers, shared fries, and two drinks",
    featured: true,
    zipCodes: ["27606", "27513", "27518"],
  },
  {
    name: "Garden Pizza Co.",
    cuisine: "Pizza",
    neighborhood: "East Market",
    priceForTwo: 29,
    deal: "Large pizza + salad bundle",
    bestOrder: "One large specialty pizza and side salad",
    featured: false,
    zipCodes: ["27610", "27601", "27545"],
  },
  {
    name: "Smokehouse Plate",
    cuisine: "BBQ",
    neighborhood: "South End",
    priceForTwo: 49,
    deal: "Shared platter keeps two people under $50",
    bestOrder: "Two-meat platter, two sides, and water or tea",
    featured: false,
    zipCodes: ["27603", "27529", "27539"],
  },
]

export function normalizeZipCode(zipCode: string): string {
  return zipCode.replace(/\D/g, "").slice(0, 5)
}

export function buildRestaurantSearchUrl(restaurantName: string, zipCode: string, wrapperBase = ""): string {
  const normalizedZip = normalizeZipCode(zipCode)
  const query = normalizedZip
    ? `${restaurantName} restaurant deals menu near ${normalizedZip}`
    : `${restaurantName} restaurant deals menu near me`
  const destination = `https://www.google.com/search?q=${encodeURIComponent(query)}`

  return wrapperBase ? wrapperBase + encodeURIComponent(destination) : destination
}

export function findRestaurantDeals(
  budget: number,
  cuisine: string,
  partySize: number,
  zipCode: string,
): RankedRestaurantDeal[] {
  const safePartySize = Math.max(1, partySize)
  const cuisineFilter = cuisine.trim().toLowerCase()
  const normalizedZip = normalizeZipCode(zipCode)

  return restaurantDeals
    .map((deal) => {
      const estimatedForParty = Math.round((deal.priceForTwo / 2) * safePartySize)
      const localMatch = !!normalizedZip && deal.zipCodes.includes(normalizedZip)
      const remainingBudget = budget - estimatedForParty

      return {
        ...deal,
        localMatch,
        estimatedForParty,
        savingsScore: Math.max(0, remainingBudget) + (localMatch ? 25 : 0) + (deal.featured ? 5 : 0),
      }
    })
    .filter((deal) => deal.estimatedForParty <= budget)
    .filter((deal) => !cuisineFilter || cuisineFilter === "any" || deal.cuisine.toLowerCase().includes(cuisineFilter))
    .sort((a, b) => Number(b.localMatch) - Number(a.localMatch) || b.savingsScore - a.savingsScore)
}
