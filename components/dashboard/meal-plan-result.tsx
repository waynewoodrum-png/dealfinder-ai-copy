"use client"

import { Store, Lightbulb, UtensilsCrossed, ShoppingCart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { MealPlanData } from "@/lib/meal-plan"

const CATEGORY_ORDER = [
  "Produce",
  "Meat & Seafood",
  "Dairy & Eggs",
  "Bakery",
  "Frozen",
  "Pantry",
  "Other",
]

function money(n: number) {
  return `$${n.toFixed(2)}`
}

export function MealPlanResult({ data, budget }: { data: MealPlanData; budget: number }) {
  const pct = Math.min(100, Math.round((data.estimatedTotal / budget) * 100))
  const remaining = budget - data.estimatedTotal

  const grouped = CATEGORY_ORDER.map((cat) => ({
    category: cat,
    items: data.shoppingList.filter((i) => i.category === cat),
  })).filter((g) => g.items.length > 0)

  return (
    <div className="flex flex-col gap-4">
      {/* Budget summary */}
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                <Store className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs text-muted-foreground">Best value store</p>
                <p className="font-semibold text-foreground">{data.store}</p>
              </div>
            </div>
            <Badge
              className={
                remaining >= 0
                  ? "bg-primary/10 text-primary"
                  : "bg-destructive/10 text-destructive"
              }
            >
              {remaining >= 0 ? `${money(remaining)} under budget` : `${money(-remaining)} over`}
            </Badge>
          </div>

          <div>
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="text-sm text-muted-foreground">Estimated total</span>
              <span className="font-mono text-lg font-semibold text-foreground">
                {money(data.estimatedTotal)}{" "}
                <span className="text-sm font-normal text-muted-foreground">/ {money(budget)}</span>
              </span>
            </div>
            <Progress value={pct} />
          </div>

          <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{data.summary}</p>
        </CardContent>
      </Card>

      <Tabs defaultValue="meals">
        <TabsList className="w-full">
          <TabsTrigger value="meals">
            <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />
            Meal plan
          </TabsTrigger>
          <TabsTrigger value="shopping">
            <ShoppingCart className="h-4 w-4" aria-hidden="true" />
            Shopping list
          </TabsTrigger>
        </TabsList>

        {/* Meal plan tab */}
        <TabsContent value="meals" className="mt-4 flex flex-col gap-3">
          {data.days.map((d) => (
            <Card key={d.day}>
              <CardHeader className="flex flex-row items-center justify-between gap-2 pb-3">
                <CardTitle className="text-base">{d.day}</CardTitle>
                <span className="font-mono text-sm text-muted-foreground">{money(d.estimatedCost)}</span>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pb-4">
                <Meal label="Breakfast" value={d.breakfast} />
                <Separator />
                <Meal label="Lunch" value={d.lunch} />
                <Separator />
                <Meal label="Dinner" value={d.dinner} />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Shopping list tab */}
        <TabsContent value="shopping" className="mt-4 flex flex-col gap-3">
          {grouped.map((g) => (
            <Card key={g.category}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">{g.category}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-2 pb-4">
                {g.items.map((item, idx) => (
                  <div key={idx} className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">{item.item}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity}</p>
                    </div>
                    <span className="shrink-0 font-mono text-sm text-foreground">{money(item.price)}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {data.tips.length > 0 && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm text-primary">
              <Lightbulb className="h-4 w-4" aria-hidden="true" />
              Money-saving tips
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-4">
            <ul className="flex flex-col gap-2">
              {data.tips.map((tip, idx) => (
                <li key={idx} className="flex gap-2 text-sm leading-relaxed text-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

function Meal({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <span className="w-20 shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  )
}
