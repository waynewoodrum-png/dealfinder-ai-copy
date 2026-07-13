import { Search, Bell, PiggyBank } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Add what you want",
    description: "Tell DealFinder the products or categories you care about. AI starts tracking prices instantly.",
  },
  {
    icon: Bell,
    title: "AI catches the drops",
    description: "We monitor prices 24/7 across merchants and alert you the moment a real deal appears.",
  },
  {
    icon: PiggyBank,
    title: "Watch your savings grow",
    description: "Every claimed deal is logged, so you always see exactly how much you've saved this month.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Saving money, on autopilot
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            Set it once and let the AI do the hunting. Three simple steps between you and a smaller bill.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.title} className="rounded-2xl border border-border bg-card p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <step.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="font-mono text-sm text-muted-foreground">Step {i + 1}</span>
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
