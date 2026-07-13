import { TrendingDown } from "lucide-react"

export function SiteFooter() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row sm:px-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <TrendingDown className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-sm font-semibold text-foreground">DealFinder AI</span>
        </div>
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} DealFinder AI. Saving you money, automatically.
        </p>
      </div>
    </footer>
  )
}
