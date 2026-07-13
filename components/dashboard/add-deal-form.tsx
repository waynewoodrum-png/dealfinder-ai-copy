"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { Plus } from "lucide-react"
import { addDeal } from "@/app/actions/deals"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

const CATEGORIES = ["Electronics", "Fashion", "Home", "Subscriptions", "Groceries", "Travel", "Other"]

export function AddDealForm() {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const data = new FormData(form)
    const title = String(data.get("title") ?? "").trim()
    const merchant = String(data.get("merchant") ?? "").trim()
    const category = String(data.get("category") ?? "Other")
    const originalPrice = Number(data.get("originalPrice"))
    const dealPrice = Number(data.get("dealPrice"))

    if (!title || !merchant) {
      setError("Please fill in the product and merchant.")
      return
    }
    if (!(originalPrice > 0) || !(dealPrice >= 0) || dealPrice > originalPrice) {
      setError("Deal price must be lower than the original price.")
      return
    }

    startTransition(async () => {
      await addDeal({ title, merchant, category, originalPrice, dealPrice })
      form.reset()
      setOpen(false)
    })
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="min-h-11 w-full sm:w-auto">
        <Plus className="h-4 w-4" aria-hidden="true" />
        Track a new deal
      </Button>
    )
  }

  return (
    <Card className="border-border bg-card p-6">
      <h2 className="text-sm font-semibold text-foreground">Track a new deal</h2>
      <p className="mt-1 text-xs text-muted-foreground">Add an item and the price you found it for.</p>
      <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 sm:col-span-2">
          <Label htmlFor="title">Product</Label>
          <Input id="title" name="title" placeholder="e.g. Sony WH-1000XM5" required className="text-base" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="merchant">Merchant</Label>
          <Input id="merchant" name="merchant" placeholder="e.g. Amazon" required className="text-base" />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="category">Category</Label>
          <select
            id="category"
            name="category"
            defaultValue="Electronics"
            className="h-9 rounded-md border border-input bg-background px-3 text-base text-foreground"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="originalPrice">Original price ($)</Label>
          <Input
            id="originalPrice"
            name="originalPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="399.99"
            required
            className="text-base"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="dealPrice">Deal price ($)</Label>
          <Input
            id="dealPrice"
            name="dealPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="279.99"
            required
            className="text-base"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive sm:col-span-2" role="alert">
            {error}
          </p>
        )}

        <div className="flex gap-2 sm:col-span-2">
          <Button type="submit" disabled={isPending} className="min-h-11">
            {isPending ? "Adding..." : "Add deal"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setOpen(false)
              setError(null)
            }}
            className="min-h-11"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  )
}
