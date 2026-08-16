import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

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
      <section className="border-b border-[--color-border]">
        <div className="container py-14">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted] mb-6">
            <Link href="/resources" className="hover:text-[--color-text]">Resources</Link>
            <span>/</span>
            <span className="text-[--color-text]">Comparison map</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] mb-3">
            Collaboration.AI vs. the alternatives
          </h1>
          <p className="text-[--color-text-muted] max-w-xl">
            Every page is built from structured facts, with a named approver on every claim.
            No marketing copy — just what we know, sourced and dated.
          </p>
        </div>
      </section>

      <div className="container py-10">
        {competitors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[--color-border] px-6 py-16 text-center text-sm text-[--color-text-muted]">
            No competitor pages published yet.
          </div>
        ) : (
          <>
            {/* Summary table */}
            <div className="overflow-x-auto rounded-xl border border-[--color-border] mb-10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[--color-border] bg-[--color-bg-subtle]">
                    <th className="text-left px-5 py-3 font-semibold text-[--color-text-muted]">Competitor</th>
                    <th className="text-left px-5 py-3 font-semibold text-[--color-text-muted]">Positioning</th>
                    <th className="text-left px-5 py-3 font-semibold text-[--color-text-muted] whitespace-nowrap">Claims tracked</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-[--color-border]">
                  {competitors.map((c) => (
                    <tr key={c.id} className="hover:bg-[--color-bg-subtle] transition-colors">
                      <td className="px-5 py-4 font-semibold text-[--color-text]">{c.name}</td>
                      <td className="px-5 py-4 text-[--color-text-muted] max-w-sm">
                        <p className="line-clamp-2">{c.positioning ?? '—'}</p>
                      </td>
                      <td className="px-5 py-4 text-[--color-text-muted]">
                        {Array.isArray(c.facts) ? c.facts.length : 0}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/resources/compare/${c.slug}`}
                          className="text-sm font-medium text-[--color-brand-600] hover:underline whitespace-nowrap"
                        >
                          Full page →
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
                  className="group rounded-xl border border-[--color-border] bg-white p-5 hover:border-[--color-brand-400] hover:shadow-[--shadow-card] transition-all"
                >
                  <h2 className="font-bold text-[--color-text] mb-2 group-hover:text-[--color-brand-700]">
                    vs. {c.name}
                  </h2>
                  {c.positioning && (
                    <p className="text-sm text-[--color-text-muted] line-clamp-2 mb-3">{c.positioning}</p>
                  )}
                  <p className="text-xs text-[--color-text-muted]">
                    {Array.isArray(c.facts) ? c.facts.length : 0} verified claims
                  </p>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  )
}
