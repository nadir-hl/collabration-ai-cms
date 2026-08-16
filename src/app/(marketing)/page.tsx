import Link from 'next/link'
import { ScanSearch, GitBranch, TrendingUp, Brain, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DashboardCard } from '@/components/DashboardCard'

const products: Array<{
  name: string; href: string; tagline: string; description: string
  Icon: LucideIcon; num: string; iconGradient: string; accentColor: string
  pillBg: string; features: string[]
}> = [
  {
    name: 'Source',
    href: '/products/source',
    tagline: 'Find the right people, faster',
    description:
      'AI-assisted prospecting that surfaces the contacts most likely to convert, before your competitors reach them.',
    Icon: ScanSearch,
    num: '01',
    iconGradient: 'linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%)',
    accentColor: '#1d4ed8',
    pillBg: '#EFF6FF',
    features: ['Contact scoring', 'AI outreach', 'CRM sync'],
  },
  {
    name: 'Decide',
    href: '/products/decide',
    tagline: 'Structured decisions at scale',
    description:
      'Move deals through the funnel with structured qualification, AI scoring, and built-in approval gates.',
    Icon: GitBranch,
    num: '02',
    iconGradient: 'linear-gradient(135deg, #6d28d9 0%, #a78bfa 100%)',
    accentColor: '#6d28d9',
    pillBg: '#F5F3FF',
    features: ['Qualification criteria', 'AI scoring', 'Approval gates'],
  },
  {
    name: 'Acquire',
    href: '/products/acquire',
    tagline: 'Turn pipeline into revenue',
    description:
      'Close faster with AI-drafted proposals, objection handling, and real-time competitive intelligence.',
    Icon: TrendingUp,
    num: '03',
    iconGradient: 'linear-gradient(135deg, #0e7490 0%, #22d3ee 100%)',
    accentColor: '#0e7490',
    pillBg: '#ECFEFF',
    features: ['AI proposals', 'Objection playbooks', 'Live intel'],
  },
  {
    name: 'Intelligence',
    href: '/products/intelligence',
    tagline: 'Know what your market is doing',
    description:
      "Track competitors, surface signals, and keep your team aligned on what's changing and why it matters.",
    Icon: Brain,
    num: '04',
    iconGradient: 'linear-gradient(135deg, #b45309 0%, #fbbf24 100%)',
    accentColor: '#b45309',
    pillBg: '#FFFBEB',
    features: ['Competitor tracking', 'Signal alerts', 'Team digests'],
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden border-b border-[--color-border]">
        <div className="container relative z-10 py-20 md:py-24">
          <div className="grid lg:grid-cols-[42%_58%] gap-10 lg:gap-12 items-center">
            {/* Left: Copy */}
            <div>
              <div className="section-label mb-6">AI for the full revenue cycle</div>
              <h1 className="display-xl">
                The platform built for how teams actually{' '}
                <span className="text-gradient">sell</span>
              </h1>
              <p className="text-body-lg mt-6 text-[--color-text-muted]">
                Four connected products. One platform. Every stage from sourcing to
                closing, with AI that drafts, scores, and tracks — and humans who
                approve and ship.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link href="/contact" className="btn btn-secondary btn-lg">
                  Contact us
                </Link>
                <Link href="/get-started" className="btn btn-primary btn-lg">
                  Get started free <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right: Dashboard card */}
            <DashboardCard />
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="bg-glow-sides">
        <div className="container py-20 md:py-24">
          <div className="text-center mb-14">
            <div className="section-label mx-auto mb-4">Products</div>
            <h2 className="display-md">
              Which product is right for your team?
            </h2>
            <p className="text-body-lg mt-3 text-[--color-text-muted] max-w-lg mx-auto">
              Each product works independently and gets more powerful when connected.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {products.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-[--color-border] p-8 hover:-translate-y-1.5 transition-all duration-300"
                style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}
              >
                {/* Number badge */}
                <span
                  className="absolute top-6 right-7 text-xs font-bold tracking-widest"
                  style={{ color: '#d1d5db' }}
                >
                  {p.num}
                </span>

                {/* Icon box */}
                <div
                  className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl text-white shadow-lg"
                  style={{ background: p.iconGradient, boxShadow: `0 8px 24px -4px ${p.accentColor}40` }}
                >
                  <p.Icon size={24} />
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-[--color-text] mb-1">{p.name}</h3>

                {/* Tagline */}
                <p className="text-sm font-semibold mb-4" style={{ color: p.accentColor }}>
                  {p.tagline}
                </p>

                {/* Description */}
                <p className="text-sm text-[--color-text-muted] leading-relaxed mb-6 flex-1">
                  {p.description}
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mb-7">
                  {p.features.map((f) => (
                    <span
                      key={f}
                      className="text-xs font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: p.pillBg, color: p.accentColor }}
                    >
                      {f}
                    </span>
                  ))}
                </div>

                {/* CTA row */}
                <div className="border-t border-[--color-border] pt-5">
                  <span
                    className="inline-flex items-center gap-1.5 text-sm font-semibold group-hover:gap-3 transition-all duration-200"
                    style={{ color: p.accentColor }}
                  >
                    Explore {p.name}
                    <ArrowRight size={14} className="translate-x-0 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </span>
                </div>

                {/* Corner glow on hover */}
                <div
                  className="pointer-events-none absolute -bottom-10 -right-10 h-44 w-44 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: p.accentColor + '20' }}
                />

                {/* Top accent line — slides in on hover */}
                <div
                  className="absolute top-0 left-0 h-0.5 w-0 group-hover:w-full transition-all duration-500 ease-out rounded-b-full"
                  style={{ background: p.iconGradient }}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-[--color-border] bg-glow-top">
        <div className="container py-12 text-center">
          <p className="text-xs font-semibold text-[--color-text-muted] uppercase tracking-widest mb-8">
            Trusted by revenue teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40 grayscale">
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((name) => (
              <span key={name} className="text-sm font-bold text-[--color-neutral-600] tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-20 md:py-24 text-center">
          <div className="section-label mx-auto mb-6">Get started today</div>
          <h2 className="display-md mb-4">Ready to see it in action?</h2>
          <p className="text-body mb-10 max-w-md mx-auto text-[--color-text-muted]">
            Talk to us about your team&apos;s pipeline and we&apos;ll show you the products that fit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn btn-outline btn-md">Talk to us</Link>
            <Link href="/get-started" className="btn btn-primary btn-md">
              Try for free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
