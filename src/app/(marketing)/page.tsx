import Link from 'next/link'

const products = [
  {
    name: 'Source',
    href: '/products/source',
    tagline: 'Find the right people, faster',
    description: 'AI-assisted prospecting that surfaces the contacts most likely to convert, before your competitors reach them.',
    icon: '◎',
  },
  {
    name: 'Decide',
    href: '/products/decide',
    tagline: 'Structured decisions at scale',
    description: 'Move deals through the funnel with structured qualification, AI scoring, and built-in approval gates.',
    icon: '◈',
  },
  {
    name: 'Acquire',
    href: '/products/acquire',
    tagline: 'Turn pipeline into revenue',
    description: 'Close faster with AI-drafted proposals, objection handling, and real-time competitive intelligence.',
    icon: '◆',
  },
  {
    name: 'Intelligence',
    href: '/products/intelligence',
    tagline: 'Know what your market is doing',
    description: "Track competitors, surface signals, and keep your team aligned on what's changing and why it matters.",
    icon: '◉',
  },
]

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-[--color-border] bg-[--color-bg]">
        <div className="container py-20 md:py-28 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand-500] mb-4">
            AI for the full revenue cycle
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[--color-brand-900] max-w-3xl mx-auto leading-tight">
            The platform built for how teams actually sell
          </h1>
          <p className="mt-6 text-lg md:text-xl text-[--color-text-muted] max-w-2xl mx-auto leading-relaxed">
            Four connected products. One platform. Every stage from sourcing to closing,
            with AI that drafts, scores, and tracks — and humans who approve and ship.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="rounded-lg bg-[--color-brand-600] px-6 py-3 text-sm font-semibold text-white hover:bg-[--color-brand-700] transition-colors"
            >
              Talk to us
            </Link>
            <Link
              href="/products/source"
              className="rounded-lg border border-[--color-border] px-6 py-3 text-sm font-semibold text-[--color-text] hover:bg-[--color-bg-subtle] transition-colors"
            >
              See the products →
            </Link>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="bg-[--color-bg-subtle]">
        <div className="container py-16 md:py-20">
          <h2 className="text-2xl md:text-3xl font-bold text-[--color-brand-900] text-center mb-4">
            Which product is right for your team?
          </h2>
          <p className="text-[--color-text-muted] text-center mb-12 max-w-xl mx-auto">
            Each product works independently and gets more powerful when connected to the others.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {products.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group rounded-xl border border-[--color-border] bg-white p-6 hover:border-[--color-brand-400] hover:shadow-[--shadow-card] transition-all"
              >
                <div className="flex items-start gap-4">
                  <span className="text-2xl text-[--color-brand-500] mt-0.5" aria-hidden>{p.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-[--color-text]">{p.name}</h3>
                      <span className="text-xs text-[--color-text-muted]">— {p.tagline}</span>
                    </div>
                    <p className="mt-2 text-sm text-[--color-text-muted] leading-relaxed">{p.description}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[--color-brand-600] group-hover:gap-2 transition-all">
                      Learn more <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="border-y border-[--color-border] bg-[--color-bg]">
        <div className="container py-12 text-center">
          <p className="text-sm text-[--color-text-muted] font-medium uppercase tracking-wider mb-8">
            Trusted by revenue teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-50 grayscale">
            {/* Logo placeholders — replace with real SVGs */}
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((name) => (
              <span key={name} className="text-sm font-semibold text-[--color-neutral-600] tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-[--color-brand-900]">
        <div className="container py-16 md:py-20 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ready to see it in action?
          </h2>
          <p className="text-[--color-brand-300] mb-8 max-w-md mx-auto">
            Talk to us about your team's pipeline and we'll show you the products that fit.
          </p>
          <Link
            href="/contact"
            className="inline-block rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[--color-brand-900] hover:bg-[--color-brand-50] transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
