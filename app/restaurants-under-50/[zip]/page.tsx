import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ZipDealPage } from "@/components/seo/zip-deal-page"
import { getZipLabel, hasDealsForZip } from "@/lib/seo-zip"

type PageProps = { params: Promise<{ zip: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zip } = await params
  const label = getZipLabel(zip)
  return {
    title: `Restaurants under $50 near ${label} | DealFinder AI`,
    description: `Find restaurants where two people can eat under $50 near ${label}, with coupon and delivery links.`,
  }
}

export default async function RestaurantsUnder50Page({ params }: PageProps) {
  const { zip } = await params
  if (!hasDealsForZip(zip)) notFound()
  return <ZipDealPage zipCode={zip} variant="restaurants" />
}
