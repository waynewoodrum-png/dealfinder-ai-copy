import { redirect } from "next/navigation"
import Link from "next/link"
import { headers } from "next/headers"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { MealPlanner } from "@/components/dashboard/meal-planner"
import { getMealPlans } from "@/app/actions/meal-plan"

export const metadata = {
  title: "Meal Planner | DealFinder AI",
  description: "AI-powered weekly budget meal plans and grocery shopping lists.",
}

export default async function MealPlanPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const savedPlans = await getMealPlans()

  return (
    <div className="min-h-dvh bg-background">
      <DashboardHeader name={session.user.name} email={session.user.email} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
            Meal planner
          </h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Plan a full week of meals and a smart shopping list that fits your grocery budget.
          </p>
        </div>
        <MealPlanner savedPlans={savedPlans} />
      </main>
    </div>
  )
}
