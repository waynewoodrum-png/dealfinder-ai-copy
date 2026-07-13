import { z } from "zod"

export const DIET_OPTIONS = [
  "No restrictions",
  "Vegetarian",
  "High protein",
  "Low carb",
] as const

export const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const

// Schema the AI must fill. Keep descriptions tight so the model stays on-budget.
export const mealPlanSchema = z.object({
  store: z
    .string()
    .describe("The single best-value grocery store to shop at for this budget (e.g. Aldi, Walmart, Costco)."),
  summary: z
    .string()
    .describe("One or two sentences explaining the strategy used to stay under budget."),
  estimatedTotal: z
    .number()
    .describe("Total estimated cost of all shopping items in US dollars. Must be less than or equal to the budget."),
  days: z
    .array(
      z.object({
        day: z.enum(DAYS),
        breakfast: z.string().describe("Breakfast meal name, concise."),
        lunch: z.string().describe("Lunch meal name, concise."),
        dinner: z.string().describe("Dinner meal name, concise."),
        estimatedCost: z.number().describe("Estimated cost of this day's meals in US dollars."),
      }),
    )
    .length(7)
    .describe("Exactly 7 days, Monday through Sunday."),
  shoppingList: z
    .array(
      z.object({
        item: z.string().describe("Grocery product name, specific (e.g. 'Chicken thighs, 5 lb bag')."),
        category: z
          .enum([
            "Produce",
            "Meat & Seafood",
            "Dairy & Eggs",
            "Pantry",
            "Frozen",
            "Bakery",
            "Other",
          ])
          .describe("Grocery aisle category."),
        quantity: z.string().describe("How much to buy (e.g. '2 lb', '1 dozen', '3 cans')."),
        price: z.number().describe("Estimated price for this item in US dollars."),
      }),
    )
    .describe("Every product needed to cook all 7 days of meals, priced to fit the budget."),
  tips: z
    .array(z.string())
    .describe("2-4 short money-saving tips specific to this plan."),
})

export type MealPlanData = z.infer<typeof mealPlanSchema>

export type SavedMealPlan = {
  id: number
  budget: number
  household: number
  diet: string
  store: string
  estimatedTotal: number
  plan: MealPlanData
  createdAt: string
}
