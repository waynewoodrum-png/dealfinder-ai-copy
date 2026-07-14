import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ZipDealPage } from "@/components/seo/zip-deal-page"
import { getZipLabel, hasDealsForZip } from "@/lib/seo-zip"

type PageProps = { params: Promise<{ zip: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { zip } = await params
  const label = getZipLabel(zip)
  return {
    title: `AI deals near ${label} | DealFinder AI`,
    description: `Find restaurant deals, coupons, delivery links, and date-night bundles near ${label}.`,
  }
}

export default async function DealsZipPage({ params }: PageProps) {
  const { zip } = await params
  if (!hasDealsForZip(zip)) notFound()
  return <ZipDealPage zipCode={zip} variant="all" />
}
