import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Case Studies',
  description: 'How teams use Collaboration.AI to win more deals.',
}

export default async function CaseStudiesPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'case-studies',
    where: { _status: { equals: 'published' } },
    limit: 50,
  })

  return (
    <>
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-16 md:py-20">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted] mb-8">
            <Link href="/resources" className="hover:text-[--color-text] transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-[--color-text]">Case studies</span>
          </nav>
          <div className="section-label mb-5">Customer stories</div>
          <h1 className="display-md max-w-2xl mb-4">
            How real teams <span className="text-gradient">win more deals</span>
          </h1>
          <p className="text-body-lg text-[--color-text-muted] max-w-xl">
            How real revenue teams use Collaboration.AI to source faster, qualify better,
            and close more.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section>
        <div className="container py-14">
          {docs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[--color-border] px-6 py-16 text-center text-sm text-[--color-text-muted]">
              No case studies published yet.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {docs.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/resources/case-studies/${cs.slug}`}
                  className="group card card-hover flex flex-col overflow-hidden"
                  style={{ padding: 0 }}
                >
                  <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #2563eb, #22d3ee)' }} />
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[--color-brand-500] mb-4">
                      Case study
                    </p>
                    <h2 className="text-lg font-bold text-[--color-text] group-hover:text-[--color-brand-600] leading-snug mb-2 transition-colors">
                      {cs.client}
                    </h2>
                    {cs.mission && (
                      <p className="text-sm text-[--color-text-muted] line-clamp-3 leading-relaxed flex-1">
                        {cs.mission}
                      </p>
                    )}
                    <span className="mt-5 text-sm font-semibold text-[--color-brand-600] flex items-center gap-1 group-hover:gap-2 transition-all duration-150">
                      Read story <ArrowRight size={14} aria-hidden />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xl font-bold mb-1">Want results like these?</p>
              <p className="text-sm text-[--color-text-muted]">Talk to us about your team&apos;s revenue cycle.</p>
            </div>
            <Link href="/contact" className="btn btn-primary btn-lg shrink-0">
              Talk to us <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
