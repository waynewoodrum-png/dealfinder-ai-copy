"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, Loader2, Save, Trash2, RotateCcw, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MealPlanResult } from "@/components/dashboard/meal-plan-result"
import {
  generateMealPlan,
  saveMealPlan,
  deleteMealPlan,
  type GenerateInput,
} from "@/app/actions/meal-plan"
import { DIET_OPTIONS, type MealPlanData, type SavedMealPlan } from "@/lib/meal-plan"

const HOUSEHOLD = ["1", "2", "3", "4", "5"]

function householdLabel(v: string) {
  return v === "1" ? "1 person" : `${v} people`
}

export function MealPlanner({
  savedPlans,
  affiliateEnabled = true,
}: {
  savedPlans: SavedMealPlan[]
  affiliateEnabled?: boolean
}) {
  const router = useRouter()
  const [budget, setBudget] = useState("200")
  const [household, setHousehold] = useState("1")
  const [diet, setDiet] = useState<string>(DIET_OPTIONS[0])

  const [result, setResult] = useState<MealPlanData | null>(null)
  const [usedBudget, setUsedBudget] = useState(200)
  const [error, setError] = useState<string | null>(null)
  const [generating, startGenerate] = useTransition()
  const [saving, startSave] = useTransition()
  const [saved, setSaved] = useState(false)

  const input: GenerateInput = {
    budget: Number(budget) || 0,
    household: Number(household),
    diet,
  }

  function handleGenerate() {
    setError(null)
    setSaved(false)
    startGenerate(async () => {
      const res = await generateMealPlan(input)
      if (res.ok) {
        setResult(res.data)
        setUsedBudget(input.budget)
      } else {
        setResult(null)
        setError(res.error)
      }
    })
  }

  function handleSave() {
    if (!result) return
    startSave(async () => {
      await saveMealPlan({ ...input, budget: usedBudget }, result)
      setSaved(true)
      router.refresh()
    })
  }

  function handleDelete(id: number) {
    startSave(async () => {
      await deleteMealPlan(id)
      router.refresh()
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Generator form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
            </span>
            Weekly budget meal plan
          </CardTitle>
          <CardDescription>
            Set your weekly grocery budget and let AI build a 7-day plan with a store shopping list that fits.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="budget">Weekly budget</Label>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  $
                </span>
                <Input
                  id="budget"
                  inputMode="numeric"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value.replace(/[^0-9]/g, ""))}
                  className="h-11 pl-7 text-base"
                  placeholder="200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="household">Household</Label>
              <Select value={household} onValueChange={(v) => setHousehold(v as string)}>
                <SelectTrigger id="household" className="h-11 w-full text-base">
                  <SelectValue>{(value) => householdLabel(value as string)}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {HOUSEHOLD.map((v) => (
                    <SelectItem key={v} value={v}>
                      {householdLabel(v)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="diet">Diet</Label>
              <Select value={diet} onValueChange={(v) => setDiet(v as string)}>
                <SelectTrigger id="diet" className="h-11 w-full text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIET_OPTIONS.map((d) => (
                    <SelectItem key={d} value={d}>
                      {d}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={handleGenerate}
            disabled={generating || !budget || Number(budget) < 20}
            className="min-h-11"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                Building your plan...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                Generate meal plan
              </>
            )}
          </Button>
          {Number(budget) > 0 && Number(budget) < 20 && (
            <p className="text-xs text-destructive">Please enter a budget of at least $20.</p>
          )}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>

      {/* Generated result */}
      {result && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-semibold text-foreground">Your plan</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleGenerate} disabled={generating} className="min-h-10 bg-transparent">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Regenerate
              </Button>
              <Button onClick={handleSave} disabled={saving || saved} className="min-h-10">
                {saved ? (
                  "Saved"
                ) : (
                  <>
                    <Save className="h-4 w-4" aria-hidden="true" />
                    Save plan
                  </>
                )}
              </Button>
            </div>
          </div>
          <MealPlanResult data={result} budget={usedBudget} affiliateEnabled={affiliateEnabled} />
        </div>
      )}

      {/* Saved plans */}
      {savedPlans.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold text-foreground">Saved plans</h2>
          {savedPlans.map((p) => (
            <details key={p.id} className="group rounded-xl border border-border bg-card">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Calendar className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">
                      ${p.budget.toFixed(0)} / week · {p.store}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {householdLabel(String(p.household))} · {p.diet} ·{" "}
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <Badge className="shrink-0 bg-primary/10 text-primary">${p.estimatedTotal.toFixed(2)}</Badge>
              </summary>
              <div className="border-t border-border p-4">
                <MealPlanResult data={p.plan} budget={p.budget} affiliateEnabled={affiliateEnabled} />
                <Button
                  variant="ghost"
                  onClick={() => handleDelete(p.id)}
                  disabled={saving}
                  className="mt-3 min-h-10 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                  Delete plan
                </Button>
              </div>
            </details>
          ))}
        </div>
      )}
    </div>
  )
}
