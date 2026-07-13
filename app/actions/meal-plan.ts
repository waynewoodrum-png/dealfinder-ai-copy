"use server"

import { generateObject } from "ai"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { mealPlan } from "@/lib/db/schema"
import { and, desc, eq } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { mealPlanSchema, type MealPlanData, type SavedMealPlan } from "@/lib/meal-plan"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

export type GenerateInput = {
  budget: number
  household: number
  diet: string
}

export async function generateMealPlan(input: GenerateInput): Promise<
  { ok: true; data: MealPlanData } | { ok: false; error: string }
> {
  await getUserId()

  const budget = Math.max(20, Math.min(1000, Math.round(input.budget)))
  const household = Math.max(1, Math.min(5, Math.round(input.household)))
  const diet = input.diet || "No restrictions"

  try {
    const { object } = await generateObject({
      model: "openai/gpt-5.4-mini",
      schema: mealPlanSchema,
      prompt: `Create a realistic 7-day grocery meal plan for a household of ${household} ${
        household === 1 ? "person" : "people"
      } with a strict total weekly grocery budget of $${budget}. Dietary preference: ${diet}.

Requirements:
- Plan breakfast, lunch, and dinner for all 7 days (Monday through Sunday).
- Reuse ingredients across meals to minimize waste and cost.
- Choose ONE affordable US grocery store that offers the best value for this budget.
- Build a complete shopping list of real, specific products with realistic US prices and quantities sized for ${household} ${
        household === 1 ? "person" : "people"
      }.
- The sum of all shopping list prices (estimatedTotal) MUST be less than or equal to $${budget}. Aim for 90-99% of the budget for best value, never over.
- Keep meal names concise and practical.`,
    })

    // Guard: if the model overshoots, reject so the UI can prompt a retry.
    if (object.estimatedTotal > budget * 1.02) {
      return {
        ok: false,
        error: `The generated plan came to $${object.estimatedTotal.toFixed(
          2,
        )}, over your $${budget} budget. Please try generating again.`,
      }
    }

    return { ok: true, data: object }
  } catch (err) {
    console.error("[v0] generateMealPlan error:", err)
    return { ok: false, error: "Could not generate a meal plan right now. Please try again." }
  }
}

export async function saveMealPlan(input: GenerateInput, data: MealPlanData) {
  const userId = await getUserId()
  await db.insert(mealPlan).values({
    userId,
    budget: String(input.budget),
    household: input.household,
    diet: input.diet,
    store: data.store,
    estimatedTotal: String(data.estimatedTotal),
    plan: data,
  })
  revalidatePath("/dashboard/meal-plan")
}

export async function getMealPlans(): Promise<SavedMealPlan[]> {
  const userId = await getUserId()
  const rows = await db
    .select()
    .from(mealPlan)
    .where(eq(mealPlan.userId, userId))
    .orderBy(desc(mealPlan.createdAt))

  return rows.map((r) => ({
    id: r.id,
    budget: Number(r.budget),
    household: r.household,
    diet: r.diet,
    store: r.store,
    estimatedTotal: Number(r.estimatedTotal),
    plan: r.plan as MealPlanData,
    createdAt: r.createdAt.toISOString(),
  }))
}

export async function deleteMealPlan(id: number) {
  const userId = await getUserId()
  await db.delete(mealPlan).where(and(eq(mealPlan.id, id), eq(mealPlan.userId, userId)))
  revalidatePath("/dashboard/meal-plan")
}
