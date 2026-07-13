import Link from "next/link"
import { TrendingDown } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SiteHeader({ isAuthed }: { isAuthed: boolean }) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="DealFinder AI home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingDown className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">DealFinder AI</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          <a href="#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            How it works
          </a>
          <a href="#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#proof" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Results
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {isAuthed ? (
            <Button className="min-h-10" render={<Link href="/dashboard">Dashboard</Link>} />
          ) : (
            <>
              <Button
                variant="ghost"
                className="hidden min-h-10 sm:inline-flex"
                render={<Link href="/sign-in">Sign in</Link>}
              />
              <Button className="min-h-10" render={<Link href="/sign-up">Get started</Link>} />
            </>
          )}
        </div>
      </div>
    </header>
  )
}
