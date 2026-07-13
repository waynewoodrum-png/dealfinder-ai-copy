import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 pt-16 pb-12 sm:px-6 sm:pt-24 sm:pb-20">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            AI-powered price tracking
          </span>
          <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-6xl">
            Let AI hunt down every deal, so you never overpay again
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            DealFinder AI watches prices around the clock, catches the drops, and shows you exactly how much you&apos;ve
            saved. Real savings, tracked automatically.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              size="lg"
              className="min-h-12 w-full sm:w-auto"
              render={
                <Link href="/sign-up">
                  Start saving free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="min-h-12 w-full bg-transparent sm:w-auto"
              render={<a href="#how-it-works">See how it works</a>}
            />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">No credit card required. Cancel anytime.</p>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-10">
            <p className="text-center text-sm font-medium uppercase tracking-widest text-muted-foreground">
              Total saved by DealFinder members
            </p>
            <p className="mt-3 text-center font-mono text-5xl font-semibold tracking-tight text-primary sm:text-7xl">
              $2,480,913
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4 border-t border-border pt-6 text-center">
              <div>
                <p className="font-mono text-xl font-semibold text-foreground sm:text-2xl">31%</p>
                <p className="mt-1 text-xs text-muted-foreground">Avg. discount found</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-foreground sm:text-2xl">24/7</p>
                <p className="mt-1 text-xs text-muted-foreground">Price monitoring</p>
              </div>
              <div>
                <p className="font-mono text-xl font-semibold text-foreground sm:text-2xl">120k+</p>
                <p className="mt-1 text-xs text-muted-foreground">Deals delivered</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
