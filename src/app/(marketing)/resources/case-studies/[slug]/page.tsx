import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@/components/RichText'
import { BadgeCheck, ArrowLeft } from 'lucide-react'

type Args = { params: Promise<{ slug: string }> }

async function getCaseStudy(slug: string, draft: boolean) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'case-studies',
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
  const cs = await getCaseStudy(slug, false)
  if (!cs) return {}
  return { title: `${cs.client} — Case Study`, description: cs.mission ?? undefined }
}

export default async function CaseStudyPage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()
  const cs = await getCaseStudy(slug, isDraft)
  if (!cs) notFound()

  const approverName =
    cs.approver && typeof cs.approver === 'object' && 'name' in cs.approver
      ? (cs.approver as { name: string }).name
      : null

  type Quote = { text: string; attribution?: string }
  const quote = cs.quote && typeof cs.quote === 'object' && 'text' in cs.quote && (cs.quote as Quote).text
    ? cs.quote as Quote
    : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[--color-border]">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted]">
            <Link href="/resources" className="hover:text-[--color-text] transition-colors">Resources</Link>
            <span>/</span>
            <Link href="/resources/case-studies" className="hover:text-[--color-text] transition-colors">Case studies</Link>
            <span>/</span>
            <span className="text-[--color-text] truncate max-w-xs">{cs.client}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-16 md:py-20 max-w-3xl">
          <div className="section-label mb-5">Case study</div>
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            {cs.client}
          </h1>
          {cs.mission && (
            <p className="text-body-lg leading-relaxed mb-6 text-[--color-text-muted]">
              {cs.mission}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-3">
            {approverName && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold"
                style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
              >
                <BadgeCheck size={12} /> Approved by {approverName}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <article className="container py-14 md:py-18 max-w-3xl">
        <div className="space-y-12">
          {cs.problem && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                >
                  1
                </div>
                <h2 className="text-xl font-bold text-[--color-text]">The problem</h2>
              </div>
              <div className="rich-text pl-10">
                <RichText data={cs.problem as Parameters<typeof RichText>[0]['data']} />
              </div>
            </section>
          )}

          {cs.whatWeDid && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                >
                  2
                </div>
                <h2 className="text-xl font-bold text-[--color-text]">What we did</h2>
              </div>
              <div className="rich-text pl-10">
                <RichText data={cs.whatWeDid as Parameters<typeof RichText>[0]['data']} />
              </div>
            </section>
          )}

          {cs.outcome && (
            <section>
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                >
                  3
                </div>
                <h2 className="text-xl font-bold text-[--color-text]">The outcome</h2>
              </div>
              <div className="rich-text pl-10">
                <RichText data={cs.outcome as Parameters<typeof RichText>[0]['data']} />
              </div>
            </section>
          )}

          {quote && (
            <blockquote className="card" style={{ borderLeft: '4px solid var(--color-brand-500)' }}>
              <p className="text-xl font-medium text-[--color-text] leading-relaxed italic mb-4">
                &ldquo;{quote.text}&rdquo;
              </p>
              {quote.attribution && (
                <cite className="text-sm text-[--color-text-muted] not-italic font-semibold">
                  — {quote.attribution}
                </cite>
              )}
            </blockquote>
          )}
        </div>
      </article>

      {/* Footer CTA */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-14">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <p className="text-xl font-bold mb-1">Want results like this?</p>
              <p className="text-sm text-[--color-text-muted]">Talk to us about your team&apos;s pipeline.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/resources/case-studies" className="btn btn-outline btn-sm">
                <ArrowLeft size={14} /> More stories
              </Link>
              <Link href="/contact" className="btn btn-primary btn-sm">Get in touch</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
