import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getDeals } from "@/app/actions/deals"
import { toDealView, computeStats } from "@/lib/deal-stats"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatOverview } from "@/components/dashboard/stat-overview"
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown"
import { AddDealForm } from "@/components/dashboard/add-deal-form"
import { DealsList } from "@/components/dashboard/deals-list"
import { SeedPrompt } from "@/components/dashboard/seed-prompt"

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const rows = await getDeals()
  const deals = rows.map(toDealView)
  const stats = computeStats(deals)
  const firstName = session.user.name?.split(" ")[0] || "there"

  return (
    <div className="min-h-svh bg-background">
      <DashboardHeader name={session.user.name} email={session.user.email} />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Here&apos;s how your savings are stacking up.</p>
          </div>
          <AddDealForm />
        </div>

        {deals.length === 0 ? (
          <div className="mt-8">
            <SeedPrompt />
          </div>
        ) : (
          <div className="mt-8 flex flex-col gap-8">
            <StatOverview stats={stats} />
            <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="order-2 lg:order-1">
                <DealsList deals={deals} />
              </div>
              <div className="order-1 lg:order-2">
                <CategoryBreakdown stats={stats} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
