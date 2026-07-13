import { redirect } from "next/navigation"
import Link from "next/link"
import { headers } from "next/headers"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { AffiliatePanel } from "@/components/dashboard/affiliate-panel"
import { getAffiliateConfig, getAffiliateStats } from "@/app/actions/affiliate"
import { getCoinSummary } from "@/app/actions/coins"

export const metadata = {
  title: "Earnings & Affiliate | DealFinder AI",
  description: "Turn shopping into profit. Connect affiliate accounts and track estimated commissions.",
}

export default async function AffiliatePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const [config, stats, coins] = await Promise.all([
    getAffiliateConfig(),
    getAffiliateStats(),
    getCoinSummary(),
  ])

  return (
    <div className="min-h-dvh bg-background">
      <DashboardHeader name={session.user.name} email={session.user.email} coinBalance={coins.balance} />
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
            Earnings &amp; affiliate
          </h1>
          <p className="mt-1 text-muted-foreground text-pretty">
            Make money when shoppers buy through your deals and meal-plan shopping lists. Connect your
            affiliate accounts and every &quot;Shop&quot; link earns you a commission.
          </p>
        </div>
        <AffiliatePanel config={config} stats={stats} />
      </main>
    </div>
  )
}
