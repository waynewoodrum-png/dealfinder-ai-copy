"use client"

import { FormEvent, useState } from "react"
import { Check, Send } from "lucide-react"
import { Button } from "@/components/ui/button"

type Lead = {
  businessName: string
  contactEmail: string
  zipCodes: string
  offer: string
  packageInterest: string
}

const initialLead: Lead = {
  businessName: "",
  contactEmail: "",
  zipCodes: "",
  offer: "",
  packageInterest: "Featured Zip Starter",
}

export function MerchantLeadForm() {
  const [lead, setLead] = useState(initialLead)
  const [submitted, setSubmitted] = useState(false)

  function update<K extends keyof Lead>(key: K, value: Lead[K]) {
    setLead((current) => ({ ...current, [key]: value }))
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <Check className="h-5 w-5 text-primary" aria-hidden="true" />
          Lead captured
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          This MVP stores the submission in the browser only. Connect this form to email, CRM, database, or Stripe when you are ready to process merchant leads.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-medium text-foreground">
          Business name
          <input
            required
            value={lead.businessName}
            onChange={(event) => update("businessName", event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="Taco Street Grill"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Contact email
          <input
            required
            type="email"
            value={lead.contactEmail}
            onChange={(event) => update("contactEmail", event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="owner@example.com"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Target zip codes
          <input
            required
            value={lead.zipCodes}
            onChange={(event) => update("zipCodes", event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            placeholder="27601, 27603"
          />
        </label>
        <label className="text-sm font-medium text-foreground">
          Package interest
          <select
            value={lead.packageInterest}
            onChange={(event) => update("packageInterest", event.target.value)}
            className="mt-2 min-h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <option>Featured Zip Starter</option>
            <option>Local Growth</option>
            <option>Market Sponsor</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block text-sm font-medium text-foreground">
        Offer or coupon
        <textarea
          required
          value={lead.offer}
          onChange={(event) => update("offer", event.target.value)}
          className="mt-2 min-h-28 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
          placeholder="$10 off dinner for two, free appetizer, date-night bundle, etc."
        />
      </label>
      <Button className="mt-5 w-full" type="submit">
        Request featured placement
        <Send className="h-4 w-4" aria-hidden="true" />
      </Button>
    </form>
  )
}
