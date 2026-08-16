import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

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
            <Link href="/resources" className="hover:text-[--color-text]">Resources</Link>
            <span>/</span>
            <Link href="/resources/compare" className="hover:text-[--color-text]">Comparison map</Link>
            <span>/</span>
            <span className="text-[--color-text]">vs. {c.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[--color-border]">
        <div className="container py-12 max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">
            Competitor intelligence
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] mb-4">
            Collaboration.AI vs. {c.name}
          </h1>
          {c.positioning && (
            <p className="text-[--color-text-muted] max-w-2xl leading-relaxed">{c.positioning}</p>
          )}
          <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-[--color-text-muted]">
            <span>{facts.length} verified claim{facts.length !== 1 ? 's' : ''}</span>
            {approverName && <span>Approved by {approverName}</span>}
          </div>
        </div>
      </header>

      {/* Fact table */}
      <section className="container py-10 max-w-5xl">
        {facts.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[--color-border] px-6 py-12 text-center text-sm text-[--color-text-muted]">
            No claims published yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-[--color-border]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[--color-border] bg-[--color-bg-subtle]">
                  <th className="text-left px-5 py-3 font-semibold text-[--color-text-muted] w-1/4">Claim</th>
                  <th className="text-left px-5 py-3 font-semibold text-[--color-brand-700] w-1/4">Collaboration.AI</th>
                  <th className="text-left px-5 py-3 font-semibold text-[--color-text-muted] w-1/4">{c.name}</th>
                  <th className="text-left px-5 py-3 font-semibold text-[--color-text-muted] w-1/4">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[--color-border]">
                {facts.map((fact, i) => (
                  <tr key={i} className="align-top hover:bg-[--color-bg-subtle] transition-colors">
                    <td className="px-5 py-4 font-medium text-[--color-text]">{fact.claim ?? '—'}</td>
                    <td className="px-5 py-4 text-[--color-text]">{fact.ours ?? '—'}</td>
                    <td className="px-5 py-4 text-[--color-text-muted]">{fact.theirs ?? '—'}</td>
                    <td className="px-5 py-4">
                      {fact.source ? (
                        <a href={fact.source} target="_blank" rel="noopener noreferrer"
                          className="text-[--color-brand-600] hover:underline break-all">
                          Source
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
          <div className="mt-8 rounded-xl border border-[--color-brand-300] bg-[--color-brand-50] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[--color-brand-700] mb-2">Our take</h2>
            <p className="text-[--color-text] leading-relaxed">{c.verdict}</p>
          </div>
        )}
      </section>

      {/* Back + CTA */}
      <section className="border-t border-[--color-border]">
        <div className="container py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <Link href="/resources/compare" className="text-sm font-medium text-[--color-brand-600] hover:underline">
            ← Back to comparison map
          </Link>
          <Link href="/contact"
            className="rounded-lg bg-[--color-brand-600] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--color-brand-700] transition-colors">
            Talk to us
          </Link>
        </div>
      </section>
    </>
  )
}
