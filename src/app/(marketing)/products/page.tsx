import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Products',
  description: 'AI-powered products for every stage of the revenue cycle.',
}

const products = [
  {
    name: 'Source',
    slug: 'source',
    tagline: 'Find the right people, faster',
    description:
      'AI-assisted prospecting that surfaces the contacts most likely to convert, before your competitors reach them. Pulls from public and partner data, scores fit against your ICP, and drafts the first outreach.',
    icon: '◎',
  },
  {
    name: 'Decide',
    slug: 'decide',
    tagline: 'Structured decisions at scale',
    description:
      'Move deals through the funnel with structured qualification, AI scoring, and built-in approval gates. Every stage has a criteria set. Nothing advances without meeting it.',
    icon: '◈',
  },
  {
    name: 'Acquire',
    slug: 'acquire',
    tagline: 'Turn pipeline into revenue',
    description:
      'Close faster with AI-drafted proposals, objection handling based on your real win/loss data, and real-time competitive intelligence surfaced at the moment you need it.',
    icon: '◆',
  },
  {
    name: 'Intelligence',
    slug: 'intelligence',
    tagline: 'Know what your market is doing',
    description:
      "Track competitors, surface signals, and keep your team aligned on what's changing and why it matters. Competitor pages built from structured facts, not prose.",
    icon: '◉',
  },
]

export default function ProductsPage() {
  return (
    <>
      <section className="border-b border-[--color-border]">
        <div className="container py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">Platform</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] max-w-2xl">
            Four products. One platform. Every stage covered.
          </h1>
          <p className="mt-4 text-[--color-text-muted] max-w-xl leading-relaxed">
            Each product solves a distinct part of the revenue cycle. Use one, or connect them all
            — the more you connect, the smarter each one gets.
          </p>
        </div>
      </section>

      <section className="bg-[--color-bg-subtle]">
        <div className="container py-12">
          <div className="flex flex-col gap-4">
            {products.map((p, i) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group flex items-start gap-6 rounded-xl border border-[--color-border] bg-white p-6 md:p-8 hover:border-[--color-brand-400] hover:shadow-[--shadow-card] transition-all"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[--color-brand-50] text-[--color-brand-600] text-xl font-bold">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-baseline gap-3 mb-2">
                    <h2 className="text-xl font-bold text-[--color-text]">{p.name}</h2>
                    <span className="text-sm text-[--color-text-muted]">{p.tagline}</span>
                  </div>
                  <p className="text-sm text-[--color-text-muted] leading-relaxed max-w-2xl">{p.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[--color-brand-600] group-hover:gap-2 transition-all">
                    See {p.name} →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-product section */}
      <section className="border-t border-[--color-border]">
        <div className="container py-14 md:py-16">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[--color-brand-900] mb-3">
              Better together
            </h2>
            <p className="text-[--color-text-muted] leading-relaxed">
              Source feeds Decide with qualified contacts. Decide feeds Acquire with scored opportunities.
              Intelligence keeps all three calibrated against what's actually happening in the market.
              Each product shares the same fact layer, so your team works from one version of the truth.
            </p>
            <Link
              href="/contact"
              className="mt-6 inline-block rounded-lg bg-[--color-brand-600] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--color-brand-700] transition-colors"
            >
              Talk to us about the full platform
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
