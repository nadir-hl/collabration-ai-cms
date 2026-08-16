import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@/components/RichText'

type Args = { params: Promise<{ slug: string }> }

async function getCaseStudy(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies',
    where: { slug: { equals: slug }, _status: { equals: 'published' } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const cs = await getCaseStudy(slug)
  if (!cs) return {}
  return {
    title: `${cs.client} — Case Study`,
    description: cs.mission ?? undefined,
  }
}

export default async function CaseStudyPage({ params }: Args) {
  const { slug } = await params
  const cs = await getCaseStudy(slug)
  if (!cs) notFound()

  const approverName =
    cs.approver && typeof cs.approver === 'object' && 'name' in cs.approver
      ? (cs.approver as { name: string }).name
      : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[--color-border]">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted]">
            <Link href="/resources" className="hover:text-[--color-text]">Resources</Link>
            <span>/</span>
            <Link href="/resources/case-studies" className="hover:text-[--color-text]">Case studies</Link>
            <span>/</span>
            <span className="text-[--color-text] truncate max-w-xs">{cs.client}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[--color-border] bg-[--color-brand-900]">
        <div className="container py-14 md:py-18 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[--color-brand-300] mb-3">
            Case study
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-4">
            {cs.client}
          </h1>
          {cs.mission && (
            <p className="text-lg text-[--color-brand-300] leading-relaxed">{cs.mission}</p>
          )}
          {approverName && (
            <p className="mt-6 text-sm text-[--color-brand-400]">Approved by {approverName}</p>
          )}
        </div>
      </header>

      {/* Body */}
      <article className="container py-12 md:py-16 max-w-3xl space-y-12">
        {/* Problem */}
        {cs.problem && (
          <section>
            <h2 className="text-lg font-bold text-[--color-brand-900] mb-4">The problem</h2>
            <RichText data={cs.problem as Parameters<typeof RichText>[0]['data']} />
          </section>
        )}

        {/* What we did */}
        {cs.whatWeDid && (
          <section>
            <h2 className="text-lg font-bold text-[--color-brand-900] mb-4">What we did</h2>
            <RichText data={cs.whatWeDid as Parameters<typeof RichText>[0]['data']} />
          </section>
        )}

        {/* Outcome */}
        {cs.outcome && (
          <section>
            <h2 className="text-lg font-bold text-[--color-brand-900] mb-4">The outcome</h2>
            <RichText data={cs.outcome as Parameters<typeof RichText>[0]['data']} />
          </section>
        )}

        {/* Pull quote */}
        {cs.quote && typeof cs.quote === 'object' &&
          'text' in cs.quote && cs.quote.text && (
          <blockquote className="border-l-4 border-[--color-brand-500] pl-6 py-2">
            <p className="text-xl font-medium text-[--color-brand-900] leading-relaxed italic mb-3">
              &ldquo;{(cs.quote as { text: string; attribution?: string }).text}&rdquo;
            </p>
            {(cs.quote as { text: string; attribution?: string }).attribution && (
              <cite className="text-sm text-[--color-text-muted] not-italic">
                — {(cs.quote as { text: string; attribution?: string }).attribution}
              </cite>
            )}
          </blockquote>
        )}
      </article>

      {/* Footer CTA */}
      <section className="border-t border-[--color-border] bg-[--color-bg-subtle]">
        <div className="container py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-[--color-brand-900] mb-1">Want results like this?</p>
            <p className="text-sm text-[--color-text-muted]">Talk to us about your team.</p>
          </div>
          <Link
            href="/contact"
            className="rounded-lg bg-[--color-brand-600] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--color-brand-700] transition-colors"
          >
            Get in touch
          </Link>
        </div>
      </section>
    </>
  )
}
