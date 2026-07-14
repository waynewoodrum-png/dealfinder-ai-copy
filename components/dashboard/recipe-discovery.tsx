"use client"

import { FormEvent, useMemo, useState } from "react"
import { ExternalLink, Search, Soup, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buildRecipeSearchUrl, findRecipes, grocerySearchSources } from "@/lib/recipes"

const diets = ["Any", "No restrictions", "Vegetarian", "High protein"]
const cuisines = ["Any", "American", "Asian", "Italian", "Mexican"]

export function RecipeDiscovery() {
  const [budget, setBudget] = useState("20")
  const [zipCode, setZipCode] = useState("27601")
  const [diet, setDiet] = useState("Any")
  const [cuisine, setCuisine] = useState("Any")
  const [maxMinutes, setMaxMinutes] = useState("35")
  const [searched, setSearched] = useState(true)

  const numericBudget = Math.max(1, Number(budget) || 1)
  const numericMinutes = Math.max(10, Number(maxMinutes) || 35)
  const matches = useMemo(
    () => findRecipes(numericBudget, diet, numericMinutes, cuisine),
    [numericBudget, diet, numericMinutes, cuisine],
  )

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSearched(true)
  }

  return (
    <section className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Soup className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Recipe deal finder</h2>
          <p className="text-sm text-muted-foreground">Search recipes by budget, diet, time, cuisine, and grocery savings potential.</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-4 sm:grid-cols-5">
        <label className="text-sm font-medium text-foreground">
          Zip
          <input
            value={zipCode}
            onChange={(event) => setZipCode(event.target.value.replace(/[^0-9]/g, "").slice(0, 5))}
            className="mt-2 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Max cost
          <input
            value={budget}
            onChange={(event) => setBudget(event.target.value.replace(/[^0-9]/g, ""))}
            className="mt-2 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Time
          <input
            value={maxMinutes}
            onChange={(event) => setMaxMinutes(event.target.value.replace(/[^0-9]/g, ""))}
            className="mt-2 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Diet
          <select
            value={diet}
            onChange={(event) => setDiet(event.target.value)}
            className="mt-2 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {diets.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium text-foreground">
          Cuisine
          <select
            value={cuisine}
            onChange={(event) => setCuisine(event.target.value)}
            className="mt-2 min-h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {cuisines.map((option) => <option key={option}>{option}</option>)}
          </select>
        </label>
        <Button className="min-h-10 sm:col-span-5" type="submit">
          <Search className="h-4 w-4" aria-hidden="true" />
          Find budget recipes
        </Button>
      </form>

      {searched && (
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          {matches.map((recipe) => (
            <article key={recipe.title} className="rounded-xl border border-border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-foreground">{recipe.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{recipe.cuisine} · {recipe.diet} · {recipe.prepMinutes} min</p>
                </div>
                <p className="font-mono text-lg font-semibold text-primary">~${recipe.estimatedCost}</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{recipe.savingsAngle}</p>
              <p className="mt-3 text-xs text-muted-foreground">Ingredients: {recipe.ingredients.join(", ")}</p>
              <Button
                className="mt-4 w-full"
                variant="outline"
                render={
                  <a href={buildRecipeSearchUrl(recipe, zipCode)} target="_blank" rel="noopener noreferrer">
                    Search recipe + grocery deals
                    <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  </a>
                }
              />
            </article>
          ))}
        </div>
      )}

      <div className="mt-5 rounded-xl border border-dashed border-border bg-muted/30 p-4">
        <p className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Store className="h-4 w-4 text-primary" aria-hidden="true" />
          Search sources to make this app bigger
        </p>
        <ul className="mt-3 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
          {grocerySearchSources.map((source) => (
            <li key={source.name} className="rounded-lg bg-background p-3">
              <span className="font-medium text-foreground">{source.name}:</span> {source.value}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
