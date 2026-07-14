export type RestaurantDeal = {
  name: string
  cuisine: string
  neighborhood: string
  priceForTwo: number
  deal: string
  bestOrder: string
  sponsored: boolean
}

export const restaurantDeals: RestaurantDeal[] = [
  {
    name: "Taco Street Grill",
    cuisine: "Mexican",
    neighborhood: "Downtown",
    priceForTwo: 32,
    deal: "2 entree combo + chips under budget",
    bestOrder: "Two burrito bowls, chips, and fountain drinks",
    sponsored: true,
  },
  {
    name: "Noodle House Express",
    cuisine: "Asian",
    neighborhood: "Midtown",
    priceForTwo: 38,
    deal: "Lunch and early dinner specials",
    bestOrder: "Two noodle bowls and one shared appetizer",
    sponsored: false,
  },
  {
    name: "Burger Barn",
    cuisine: "American",
    neighborhood: "Westside",
    priceForTwo: 44,
    deal: "Family bundle beats ordering separately",
    bestOrder: "Two burgers, shared fries, and two drinks",
    sponsored: true,
  },
  {
    name: "Garden Pizza Co.",
    cuisine: "Pizza",
    neighborhood: "East Market",
    priceForTwo: 29,
    deal: "Large pizza + salad bundle",
    bestOrder: "One large specialty pizza and side salad",
    sponsored: false,
  },
  {
    name: "Smokehouse Plate",
    cuisine: "BBQ",
    neighborhood: "South End",
    priceForTwo: 49,
    deal: "Shared platter keeps two people under $50",
    bestOrder: "Two-meat platter, two sides, and water or tea",
    sponsored: false,
  },
]

export function buildRestaurantSearchUrl(restaurantName: string, wrapperBase = ""): string {
  const destination = `https://www.google.com/search?q=${encodeURIComponent(`${restaurantName} restaurant deals menu`)}`

  return wrapperBase ? wrapperBase + encodeURIComponent(destination) : destination
}

export function findRestaurantDeals(budget: number, cuisine: string, partySize: number): RestaurantDeal[] {
  const safePartySize = Math.max(1, partySize)
  const budgetForTwo = (budget / safePartySize) * 2
  const cuisineFilter = cuisine.trim().toLowerCase()

  return restaurantDeals
    .filter((deal) => deal.priceForTwo <= budgetForTwo)
    .filter((deal) => !cuisineFilter || cuisineFilter === "any" || deal.cuisine.toLowerCase().includes(cuisineFilter))
    .sort((a, b) => Number(b.sponsored) - Number(a.sponsored) || b.priceForTwo - a.priceForTwo)
}
