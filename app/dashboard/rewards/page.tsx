import { redirect } from "next/navigation"
import Link from "next/link"
import { headers } from "next/headers"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { RewardsPanel } from "@/components/dashboard/rewards-panel"
import { getCoinSummary } from "@/app/actions/coins"

export const metadata = {
  title: "Rewards & Coins | DealFinder AI",
  description: "Earn coins from your savings streak and redeem them for money off your next purchase.",
}

export default async function RewardsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const summary = await getCoinSummary()

  return (
    <div className="min-h-dvh bg-background">
      <DashboardHeader name={session.user.name} email={session.user.email} coinBalance={summary.balance} />
      <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground text-balance">Rewards &amp; coins</h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Every week you keep saving earns coins. Cash them in for money off your next purchase.
          </p>
        </div>
        <RewardsPanel summary={summary} />
      </main>
    </div>
  )
}
