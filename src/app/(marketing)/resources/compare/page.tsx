import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Comparison Map',
  description: "How Collaboration.AI compares to alternatives — built from structured, approved facts.",
}

export default async function CompareIndexPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: competitors } = await payload.find({
    collection: 'competitors',
    where: { _status: { equals: 'published' } },
    limit: 50,
    sort: 'name',
  })

  return (
    <>
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted] mb-8">
            <Link href="/resources" className="hover:text-[--color-text] transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-[--color-text]">Comparison map</span>
          </nav>
          <div className="section-label mb-5">Competitor intelligence</div>
          <h1 className="display-md max-w-2xl mb-4">
            Collaboration.AI vs. <span className="text-gradient">the alternatives</span>
          </h1>
          <p className="text-body-lg text-[--color-text-muted] max-w-xl">
            Every page is built from structured facts, with a named approver on every claim.
            No marketing copy — just what we know, sourced and dated.
          </p>
        </div>
      </section>

      <section>
        <div className="container py-12">
          {competitors.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[--color-border] px-6 py-16 text-center text-sm text-[--color-text-muted]">
              No competitor pages published yet.
            </div>
          ) : (
            <>
              {/* Summary table */}
              <div className="overflow-x-auto rounded-2xl border border-[--color-border] mb-12 bg-white">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[--color-border]" style={{ background: '#f7f9fb' }}>
                      <th className="text-left px-6 py-4 font-semibold text-[--color-text-muted]">Competitor</th>
                      <th className="text-left px-6 py-4 font-semibold text-[--color-text-muted]">Positioning</th>
                      <th className="text-left px-6 py-4 font-semibold text-[--color-text-muted] whitespace-nowrap">Claims</th>
                      <th className="px-6 py-4" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[--color-border]">
                    {competitors.map((c) => (
                      <tr key={c.id} className="hover:bg-[#f7f9fb] transition-colors">
                        <td className="px-6 py-4 font-bold text-[--color-text]">{c.name}</td>
                        <td className="px-6 py-4 text-[--color-text-muted] max-w-sm">
                          <p className="line-clamp-2">{c.positioning ?? '—'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold"
                            style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                          >
                            {Array.isArray(c.facts) ? c.facts.length : 0} claims
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/resources/compare/${c.slug}`}
                            className="text-sm font-semibold text-[--color-brand-600] hover:underline whitespace-nowrap"
                          >
                            Full page <ArrowRight size={12} className="inline ml-0.5" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Card grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {competitors.map((c) => (
                  <Link
                    key={c.id}
                    href={`/resources/compare/${c.slug}`}
                    className="group card card-hover flex flex-col overflow-hidden"
                    style={{ padding: 0 }}
                  >
                    <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #6366f1, #0891b2)' }} />
                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <h2 className="font-bold text-[--color-text] group-hover:text-[--color-brand-600] transition-colors">
                          vs. {c.name}
                        </h2>
                        <span
                          className="text-xs font-bold rounded-full px-2 py-0.5"
                          style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                        >
                          {Array.isArray(c.facts) ? c.facts.length : 0}
                        </span>
                      </div>
                      {c.positioning && (
                        <p className="text-sm text-[--color-text-muted] line-clamp-2 mb-4 flex-1 leading-relaxed">
                          {c.positioning}
                        </p>
                      )}
                      <span className="text-xs text-[--color-text-muted]">
                        {Array.isArray(c.facts) ? c.facts.length : 0} verified claim{(Array.isArray(c.facts) ? c.facts.length : 0) !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* Trust note */}
      <section className="border-t border-[--color-border]">
        <div className="container py-10">
          <div className="flex items-start gap-4 max-w-2xl">
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
            >
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[--color-text] mb-1">
                How we maintain this data
              </p>
              <p className="text-sm text-[--color-text-muted] leading-relaxed">
                Every claim has a named approver, a source, and a date. We do not publish competitor
                information without a named internal approver verifying it. If something&apos;s wrong,{' '}
                <Link href="/contact" className="text-[--color-brand-600] hover:underline">let us know</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
