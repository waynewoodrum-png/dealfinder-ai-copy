export type Recipe = {
  title: string
  cuisine: string
  diet: string
  prepMinutes: number
  servings: number
  estimatedCost: number
  ingredients: string[]
  savingsAngle: string
  sourceQuery: string
}

export const recipes: Recipe[] = [
  {
    title: "Sheet-pan chicken tacos",
    cuisine: "Mexican",
    diet: "High protein",
    prepMinutes: 30,
    servings: 4,
    estimatedCost: 18,
    ingredients: ["Chicken thighs", "Tortillas", "Peppers", "Onion", "Salsa"],
    savingsAngle: "Uses low-cost chicken thighs and leftovers for lunch bowls.",
    sourceQuery: "sheet pan chicken tacos budget recipe",
  },
  {
    title: "One-pot tomato basil pasta",
    cuisine: "Italian",
    diet: "Vegetarian",
    prepMinutes: 25,
    servings: 4,
    estimatedCost: 11,
    ingredients: ["Pasta", "Canned tomatoes", "Onion", "Garlic", "Parmesan"],
    savingsAngle: "Pantry-heavy meal with cheap shelf-stable ingredients.",
    sourceQuery: "one pot tomato basil pasta budget recipe",
  },
  {
    title: "Rice bowl meal prep",
    cuisine: "Asian",
    diet: "No restrictions",
    prepMinutes: 35,
    servings: 5,
    estimatedCost: 16,
    ingredients: ["Rice", "Eggs", "Frozen vegetables", "Soy sauce", "Ground turkey"],
    savingsAngle: "Batch cooks five meals from bulk rice and frozen vegetables.",
    sourceQuery: "budget rice bowl meal prep recipe",
  },
  {
    title: "Lentil chili bowls",
    cuisine: "American",
    diet: "Vegetarian",
    prepMinutes: 40,
    servings: 6,
    estimatedCost: 14,
    ingredients: ["Lentils", "Beans", "Canned tomatoes", "Chili spices", "Rice"],
    savingsAngle: "High-protein vegetarian recipe with very low cost per serving.",
    sourceQuery: "lentil chili budget recipe",
  },
]

export const grocerySearchSources = [
  {
    name: "Walmart Grocery",
    value: "Walmart pickup pricing and grocery search",
  },
  {
    name: "Instacart-style grocery search",
    value: "Multi-store grocery price discovery when official access is available",
  },
  {
    name: "Kroger / local grocery loyalty deals",
    value: "Weekly sale and loyalty-card deal matching by zip code",
  },
  {
    name: "Recipe web search",
    value: "Recipe inspiration, then DealFinder converts it into a budget shopping plan",
  },
]

export function findRecipes(budget: number, diet: string, maxMinutes: number, cuisine: string): Recipe[] {
  const dietFilter = diet.toLowerCase()
  const cuisineFilter = cuisine.toLowerCase()

  return recipes
    .filter((recipe) => recipe.estimatedCost <= budget)
    .filter((recipe) => recipe.prepMinutes <= maxMinutes)
    .filter((recipe) => dietFilter === "any" || recipe.diet.toLowerCase() === dietFilter || recipe.diet === "No restrictions")
    .filter((recipe) => cuisineFilter === "any" || recipe.cuisine.toLowerCase() === cuisineFilter)
    .sort((a, b) => a.estimatedCost - b.estimatedCost)
}

export function buildRecipeSearchUrl(recipe: Recipe, zipCode: string): string {
  const query = `${recipe.sourceQuery} grocery deals near ${zipCode || "me"}`
  return `https://www.google.com/search?q=${encodeURIComponent(query)}`
}
