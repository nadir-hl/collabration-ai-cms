import type { Metadata } from 'next'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { SiteShell } from '@/components/home/SiteShell'
import { NextSteps } from '@/components/home/NextSteps'
import { SiteFooter } from '@/components/home/SiteFooter'
import { ProductPanel } from '@/components/product/ProductPanel'
import { IntelligenceSections } from '@/components/intelligence/IntelligenceSections'

/**
 * NetworkOS Intelligence — Figma INTELLIGENCE (208:4), marked "GOOD TO BUILD!"
 * beside the frame (216:1116).
 *
 * Built the same way as the Source page (products/source): it takes
 * precedence over products/[slug] for /products/intelligence; the left
 * panel's name and summary come from the Intelligence entry in the Products
 * collection when there is one (name, oneLiner), so they can be edited in the
 * CMS, and the design's copy stands in until then. The rest of the page is the
 * design's copy.
 *
 * Background: "CAI Intelligence.mp4", re-encoded for scrubbing the same way as
 * the home and Source clips (see BackgroundVideo), with its first frame as the
 * poster.
 */

const FALLBACK = {
  name: 'Intelligence',
  summary:
    'What the organization knows, connected to what it’s missing. Kept current as people and priorities change.',
}

async function getIntelligence(draft: boolean) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: 'intelligence' } },
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
  const { name, summary } = await getIntelligence(false)
  return { title: name, description: summary.replace(/\s*\n\s*/g, ' ') }
}

export default async function IntelligencePage() {
  const { isEnabled: isDraft } = await draftMode()
  const { name, summary } = await getIntelligence(isDraft)

  return (
    <SiteShell
      panel={
        <ProductPanel eyebrow="NetworkOS" name={name} summary={summary} current="intelligence" />
      }
      video={{
        src: '/video/intelligence-bg-scrub.mp4',
        poster: '/video/intelligence-bg-poster.jpg',
      }}
    >
      {/* Figma: the first block starts at y 192, level with the panel's eyebrow */}
      <div className="pt-16 lg:pt-[192px]">
        <IntelligenceSections />
      </div>
      <NextSteps />
      <SiteFooter />
    </SiteShell>
  )
}
