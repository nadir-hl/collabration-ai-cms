import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SiteShell } from '@/components/home/SiteShell'
import { NextSteps } from '@/components/home/NextSteps'
import { SiteFooter } from '@/components/home/SiteFooter'
import { ProductPanel } from '@/components/product/ProductPanel'
import { SourceSections } from '@/components/source/SourceSections'

/**
 * NetworkOS Source — Figma SOURCE (173:3).
 *
 * Takes precedence over products/[slug] for /products/source; the other
 * products still render the generic template there until they get their own
 * designs.
 *
 * The left panel's name and summary come from the Source entry in the
 * Products collection when there is one (name, oneLiner), so they can be
 * edited in the CMS; until an entry exists the design's copy stands in.
 * The rest of the page is the design's copy.
 */

const FALLBACK = {
  name: 'Source',
  summary:
    'Where a program meets the market.\nOne solicitation, every submission, and the record of what came of them.',
}

async function getSource(draft: boolean) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'source' } },
    draft,
    overrideAccess: draft,
    limit: 1,
  })
  const doc = result.docs[0]
  return {
    name: doc?.name || FALLBACK.name,
    summary: doc?.oneLiner || FALLBACK.summary,
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { name, summary } = await getSource(false)
  return { title: name, description: summary.replace(/\s*\n\s*/g, ' ') }
}

export default async function SourcePage() {
  const { isEnabled: isDraft } = await draftMode()
  const { name, summary } = await getSource(isDraft)

  return (
    <SiteShell
      panel={<ProductPanel eyebrow="Network OS" name={name} summary={summary} current="source" />}
      // "CAI Source.mp4", re-encoded for scrubbing — see BackgroundVideo
      video={{ src: '/video/source-bg-scrub.mp4', poster: '/video/source-bg-poster.jpg' }}
    >
      {/* Figma: the first block starts at y 192, level with the panel's eyebrow */}
      <div className="pt-16 lg:pt-[192px]">
        <SourceSections />
      </div>
      <NextSteps />
      <SiteFooter />
    </SiteShell>
  )
}
