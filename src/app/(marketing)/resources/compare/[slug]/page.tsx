import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { BadgeCheck, ArrowLeft, ExternalLink } from 'lucide-react'

type Args = { params: Promise<{ slug: string }> }

type FactRow = {
  claim?: string
  ours?: string
  theirs?: string
  source?: string
  date?: string
}

async function getCompetitor(slug: string, draft: boolean) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'competitors',
    where: draft
      ? { slug: { equals: slug } }
      : { slug: { equals: slug }, _status: { equals: 'published' } },
    draft,
    overrideAccess: draft,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const c = await getCompetitor(slug, false)
  if (!c) return {}
  return {
    title: `Collaboration.AI vs. ${c.name}`,
    description: `A structured comparison of Collaboration.AI and ${c.name}, based on verified claims.`,
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

export default async function CompetitorPage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()
  const c = await getCompetitor(slug, isDraft)
  if (!c) notFound()

  const facts = (c.facts as FactRow[] | undefined) ?? []
  const approverName =
    c.approver && typeof c.approver === 'object' && 'name' in c.approver
      ? (c.approver as { name: string }).name
      : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[--color-border]">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted]">
            <Link href="/resources" className="hover:text-[--color-text] transition-colors">Resources</Link>
            <span>/</span>
            <Link href="/resources/compare" className="hover:text-[--color-text] transition-colors">Comparison map</Link>
            <span>/</span>
            <span className="text-[--color-text]">vs. {c.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-14 md:py-18 max-w-4xl">
          <div className="section-label mb-5">Competitor intelligence</div>
          <h1 className="display-md mb-4">
            Collaboration.AI <span className="text-gradient">vs. {c.name}</span>
          </h1>
          {c.positioning && (
            <p className="text-body-lg text-[--color-text-muted] max-w-2xl mb-6 leading-relaxed">
              {c.positioning}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold"
              style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
            >
              {facts.length} verified claim{facts.length !== 1 ? 's' : ''}
            </span>
            {approverName && (
              <span
                className="inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: '#f7f9fb', color: 'var(--color-text-muted)' }}
              >
                <BadgeCheck size={12} /> Approved by {approverName}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Fact table */}
      <section>
        <div className="container py-12 max-w-5xl">
          {facts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[--color-border] px-6 py-12 text-center text-sm text-[--color-text-muted]">
              No claims published yet.
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-[--color-border] bg-white">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--color-border]" style={{ background: '#f7f9fb' }}>
                    <th className="text-left px-5 py-4 font-semibold text-[--color-text-muted] w-1/4">
                      Claim
                    </th>
                    <th className="text-left px-5 py-4 font-bold w-1/4" style={{ color: 'var(--color-brand-700)' }}>
                      Collaboration.AI
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-[--color-text-muted] w-1/4">
                      {c.name}
                    </th>
                    <th className="text-left px-5 py-4 font-semibold text-[--color-text-muted] w-1/4">
                      Source
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]">
                  {facts.map((fact, i) => (
                    <tr key={i} className="align-top hover:bg-[#f7f9fb] transition-colors">
                      <td className="px-5 py-4 font-medium text-[--color-text]">{fact.claim ?? '—'}</td>
                      <td className="px-5 py-4 text-[--color-text] font-medium">{fact.ours ?? '—'}</td>
                      <td className="px-5 py-4 text-[--color-text-muted]">{fact.theirs ?? '—'}</td>
                      <td className="px-5 py-4">
                        {fact.source ? (
                          <a
                            href={fact.source}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[--color-brand-600] hover:underline text-xs"
                          >
                            Source <ExternalLink size={10} className="inline ml-0.5" />
                          </a>
                        ) : (
                          <span className="text-[--color-text-muted]">—</span>
                        )}
                        {fact.date && (
                          <span className="block text-xs text-[--color-neutral-400] mt-0.5">
                            {formatDate(fact.date)}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {c.verdict && (
            <div className="mt-8 card" style={{ borderLeftWidth: 4, borderLeftColor: 'var(--color-brand-500)' }}>
              <p className="text-xs font-bold uppercase tracking-widest text-[--color-brand-600] mb-2">
                Our take
              </p>
              <p className="text-[--color-text] leading-relaxed">{c.verdict}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-bold mb-1">Want to see how we stack up?</p>
            <p className="text-sm text-[--color-text-muted]">
              Talk to us and we&apos;ll walk you through a live comparison.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/resources/compare" className="btn btn-outline btn-sm">
              <ArrowLeft size={14} /> All comparisons
            </Link>
            <Link href="/contact" className="btn btn-primary btn-sm">Talk to us</Link>
          </div>
        </div>
      </section>
    </>
  )
}
