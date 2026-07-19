import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ZipDealPage } from "@/components/seo/zip-deal-page"
import { getZipLabel, hasDealsForZip } from "@/lib/seo-zip"

type PageProps = { params: Promise<{ zip: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zip } = await params
  const label = getZipLabel(zip)
  return {
    title: `Date-night deals near ${label} | DealFinder AI`,
    description: `Find date-night bundles with dinner, activities, dessert, coupons, and delivery links near ${label}.`,
  }
}

export default async function DateNightDealsPage({ params }: PageProps) {
  const { zip } = await params
  if (!hasDealsForZip(zip)) notFound()
  return <ZipDealPage zipCode={zip} variant="date-night" />
}
