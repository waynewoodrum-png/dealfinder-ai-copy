import { LineChart, ShieldCheck, Flame, Tag, Clock, Wallet } from "lucide-react"

const features = [
  {
    icon: LineChart,
    title: "Real savings tracking",
    description: "Every deal you claim is recorded against its original price, so your total savings are always accurate.",
  },
  {
    icon: Flame,
    title: "Savings streaks",
    description: "Keep your streak alive by claiming at least one deal a week. Momentum makes saving a habit.",
  },
  {
    icon: Tag,
    title: "Price-drop alerts",
    description: "The moment a tracked item falls, it lands in your dashboard as an active deal ready to claim.",
  },
  {
    icon: Clock,
    title: "24/7 monitoring",
    description: "AI never sleeps. Prices are checked continuously so you never miss a limited-time drop.",
  },
  {
    icon: Wallet,
    title: "Category breakdowns",
    description: "See where your savings come from — electronics, fashion, home, subscriptions, and more.",
  },
  {
    icon: ShieldCheck,
    title: "Private & secure",
    description: "Your data is scoped to your account only. We never sell your information or shopping habits.",
  },
]

export function Features() {
  return (
    <section id="features" className="border-t border-border">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to stop overpaying
          </h2>
          <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
            A calm, data-forward dashboard that turns scattered discounts into a clear picture of your savings.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <feature.icon className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
