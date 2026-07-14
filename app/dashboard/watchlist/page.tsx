import { redirect } from "next/navigation"
import Link from "next/link"
import { headers } from "next/headers"
import { ArrowLeft } from "lucide-react"
import { auth } from "@/lib/auth"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { DealWatchlistPanel } from "@/components/dashboard/deal-watchlist-panel"

export const metadata = {
  title: "Deal Watchlist | DealFinder AI",
  description: "Track target prices, rollback-style drops, and upcoming weekly deal reminders.",
}

export default async function WatchlistPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  return (
    <div className="min-h-dvh bg-background">
      <DashboardHeader name={session.user.name} email={session.user.email} />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to dashboard
        </Link>
        <DealWatchlistPanel />
      </main>
    </div>
  )
}
