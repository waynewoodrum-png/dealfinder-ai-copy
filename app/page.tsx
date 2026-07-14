import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Hero } from "@/components/landing/hero"
import { HowItWorks } from "@/components/landing/how-it-works"
import { Features } from "@/components/landing/features"
import { RetailMedia } from "@/components/landing/retail-media"
import { RestaurantDealFinder } from "@/components/landing/restaurant-deal-finder"
import { DateNightDealFinder } from "@/components/landing/date-night-deal-finder"
import { ProofCta } from "@/components/landing/proof-cta"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SiteHeader isAuthed={!!session?.user} />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <RestaurantDealFinder />
        <DateNightDealFinder />
        <RetailMedia />
        <Features />
        <ProofCta />
      </main>
      <SiteFooter />
    </div>
  )
}
