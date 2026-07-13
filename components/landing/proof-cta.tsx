import Link from "next/link"
import { ArrowRight, Quote } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote: "I saved over $600 in my first two months without lifting a finger. The streak keeps me coming back.",
    name: "Maya R.",
    detail: "Saved $612",
  },
  {
    quote: "It caught a price drop on the exact headphones I wanted and pinged me before they sold out.",
    name: "Devin K.",
    detail: "Saved $120 on one deal",
  },
  {
    quote: "Finally I can see all my savings in one place instead of guessing whether a coupon was worth it.",
    name: "Priya S.",
    detail: "31% average discount",
  },
]

export function ProofCta() {
  return (
    <>
      <section id="proof" className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Members are saving real money
            </h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Join thousands who let DealFinder AI do the bargain hunting for them.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="flex flex-col rounded-2xl border border-border bg-card p-6">
                <Quote className="h-6 w-6 text-primary" aria-hidden="true" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">{t.quote}</blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <p className="text-sm font-medium text-foreground">{t.name}</p>
                  <p className="text-xs text-primary">{t.detail}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="rounded-3xl bg-primary px-6 py-12 text-center sm:px-12 sm:py-16">
            <h2 className="mx-auto max-w-xl text-balance text-3xl font-semibold tracking-tight text-primary-foreground sm:text-4xl">
              Start tracking your savings today
            </h2>
            <p className="mx-auto mt-4 max-w-md text-pretty leading-relaxed text-primary-foreground/90">
              Create a free account and let the AI find your first deal in minutes.
            </p>
            <Button
              size="lg"
              variant="secondary"
              className="mt-8 min-h-12"
              render={
                <Link href="/sign-up">
                  Get started free
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              }
            />
          </div>
        </div>
      </section>
    </>
  )
}
