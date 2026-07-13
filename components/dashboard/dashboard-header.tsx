"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { TrendingDown, LogOut, Coins, Gift, DollarSign } from "lucide-react"
import { authClient } from "@/lib/auth-client"
import { formatCoins } from "@/lib/coins"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export function DashboardHeader({
  name,
  email,
  coinBalance,
}: {
  name: string
  email: string
  coinBalance?: number
}) {
  const router = useRouter()
  const initials = name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2" aria-label="DealFinder AI home">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <TrendingDown className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">DealFinder AI</span>
        </Link>

        <div className="flex items-center gap-2">
          {coinBalance !== undefined && (
            <Link
              href="/dashboard/rewards"
              className="flex min-h-10 items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              aria-label={`${formatCoins(coinBalance)} coins. Go to rewards.`}
            >
              <Coins className="h-4 w-4" aria-hidden="true" />
              {formatCoins(coinBalance)}
            </Link>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" className="h-10 gap-2 px-2" aria-label="Account menu">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-accent text-accent-foreground text-xs">
                      {initials || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden text-sm font-medium text-foreground sm:inline">{name}</span>
                </Button>
              }
            />
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <p className="text-sm font-medium text-foreground">{name}</p>
                <p className="text-xs font-normal text-muted-foreground">{email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/dashboard/rewards")}>
                <Gift className="h-4 w-4" aria-hidden="true" />
                Rewards &amp; coins
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/dashboard/affiliate")}>
                <DollarSign className="h-4 w-4" aria-hidden="true" />
                Earnings &amp; affiliate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4" aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
