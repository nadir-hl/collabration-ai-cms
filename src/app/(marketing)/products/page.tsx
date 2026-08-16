import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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
    accent: 'from-sky-400 to-blue-600',
  },
  {
    name: 'Decide',
    slug: 'decide',
    tagline: 'Structured decisions at scale',
    description:
      'Move deals through the funnel with structured qualification, AI scoring, and built-in approval gates. Every stage has a criteria set. Nothing advances without meeting it.',
    accent: 'from-blue-500 to-indigo-600',
  },
  {
    name: 'Acquire',
    slug: 'acquire',
    tagline: 'Turn pipeline into revenue',
    description:
      'Close faster with AI-drafted proposals, objection handling based on your real win/loss data, and real-time competitive intelligence surfaced at the moment you need it.',
    accent: 'from-indigo-500 to-violet-600',
  },
  {
    name: 'Intelligence',
    slug: 'intelligence',
    tagline: 'Know what your market is doing',
    description:
      "Track competitors, surface signals, and keep your team aligned on what's changing and why it matters. Competitor pages built from structured facts, not prose.",
    accent: 'from-violet-500 to-purple-600',
  },
]

export default function ProductsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-20 md:py-24">
          <div className="section-label mb-6">Platform</div>
          <h1 className="display-lg max-w-3xl mb-5">
            Four products. One platform. <span className="text-gradient">Every stage covered.</span>
          </h1>
          <p className="text-body-lg text-[--color-text-muted] max-w-xl">
            Each product solves a distinct part of the revenue cycle. Use one, or connect them all
            — the more you connect, the smarter each one gets.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="border-b border-[--color-border]">
        <div className="container py-14">
          <div className="grid gap-5 sm:grid-cols-2">
            {products.map((p, i) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group card card-hover flex flex-col overflow-hidden"
                style={{ padding: 0 }}
              >
                <div className={`h-2 bg-gradient-to-r ${p.accent}`} />
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-start gap-5 mb-5">
                    <div
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-xl font-bold"
                      style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-[--color-text] mb-0.5">{p.name}</h2>
                      <p className="text-sm font-medium text-[--color-brand-500]">{p.tagline}</p>
                    </div>
                  </div>
                  <p className="text-sm text-[--color-text-muted] leading-relaxed flex-1">
                    {p.description}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[--color-brand-600] group-hover:gap-2 transition-all duration-150">
                    See {p.name} <ArrowRight size={14} aria-hidden />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Better together */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-16 md:py-20">
          <div className="max-w-3xl">
            <div className="section-label mb-6">Better together</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-5 leading-tight">
              One platform. Every signal shared.
            </h2>
            <p className="text-base leading-relaxed mb-8 text-[--color-text-muted]">
              Source feeds Decide with qualified contacts. Decide feeds Acquire with scored
              opportunities. Intelligence keeps all three calibrated against what&apos;s actually
              happening in the market. Each product shares the same fact layer, so your team
              works from one version of the truth.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn btn-primary btn-lg">
                Talk to us about the full platform
              </Link>
              <Link href="/get-started" className="btn btn-outline btn-lg">
                Try for free <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
