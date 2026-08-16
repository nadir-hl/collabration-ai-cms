import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Blog posts, case studies, and competitor research from Collaboration.AI.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default async function ResourcesPage() {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: posts }, { docs: caseStudies }, { docs: competitors }] = await Promise.all([
    payload.find({ collection: 'posts', limit: 6, sort: '-date', where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'case-studies', limit: 6, where: { _status: { equals: 'published' } } }),
    payload.find({ collection: 'competitors', limit: 20, where: { _status: { equals: 'published' } } }),
  ])

  return (
    <>
      <section className="border-b border-[--color-border]">
        <div className="container py-14 md:py-18">
          <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">Resources</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900]">
            Insights, research, and case studies
          </h1>
          <p className="mt-3 text-[--color-text-muted] max-w-xl">
            Everything we publish — blog posts, customer stories, and competitor intelligence.
          </p>

          {/* Type nav */}
          <div className="mt-8 flex flex-wrap gap-2">
            {[
              { label: 'All', href: '/resources' },
              { label: 'Blog', href: '/resources#blog' },
              { label: 'Case studies', href: '/resources/case-studies' },
              { label: 'Competitor map', href: '/resources/compare' },
            ].map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="rounded-full border border-[--color-border] px-4 py-1.5 text-sm font-medium text-[--color-text-muted] hover:border-[--color-brand-400] hover:text-[--color-text] transition-colors"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="container py-12 space-y-16">

        {/* Blog posts */}
        <section id="blog">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[--color-brand-900]">Blog</h2>
            {posts.length > 0 && (
              <Link href="/resources#blog" className="text-sm font-medium text-[--color-brand-600] hover:underline">
                View all →
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <EmptyState label="No posts published yet." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/resources/${post.slug}`}
                  className="group flex flex-col rounded-xl border border-[--color-border] bg-white p-6 hover:border-[--color-brand-400] hover:shadow-[--shadow-card] transition-all"
                >
                  <div className="flex-1">
                    <p className="text-xs text-[--color-text-muted] mb-2">
                      {post.date ? formatDate(post.date as string) : ''}
                    </p>
                    <h3 className="text-base font-semibold text-[--color-text] group-hover:text-[--color-brand-700] leading-snug mb-2">
                      {post.title}
                    </h3>
                    {post.summary && (
                      <p className="text-sm text-[--color-text-muted] line-clamp-3 leading-relaxed">
                        {post.summary}
                      </p>
                    )}
                  </div>
                  <span className="mt-4 text-sm font-medium text-[--color-brand-600] group-hover:gap-2 transition-all">
                    Read more →
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Case studies */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[--color-brand-900]">Case studies</h2>
            {caseStudies.length > 0 && (
              <Link href="/resources/case-studies" className="text-sm font-medium text-[--color-brand-600] hover:underline">
                View all →
              </Link>
            )}
          </div>

          {caseStudies.length === 0 ? (
            <EmptyState label="No case studies published yet." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-6">
              {caseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/resources/case-studies/${cs.slug}`}
                  className="group flex flex-col rounded-xl border border-[--color-border] bg-white p-6 hover:border-[--color-brand-400] hover:shadow-[--shadow-card] transition-all"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[--color-brand-500] mb-2">
                    Case study
                  </p>
                  <h3 className="text-base font-semibold text-[--color-text] group-hover:text-[--color-brand-700] leading-snug mb-2">
                    {cs.client}
                  </h3>
                  {cs.mission && (
                    <p className="text-sm text-[--color-text-muted] line-clamp-2 leading-relaxed">{cs.mission}</p>
                  )}
                  <span className="mt-4 text-sm font-medium text-[--color-brand-600]">Read story →</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Competitor map teaser */}
        <section>
          <div className="rounded-xl border border-[--color-border] bg-[--color-bg-subtle] p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[--color-brand-500] mb-1">
                Competitor intelligence
              </p>
              <h2 className="text-xl font-bold text-[--color-brand-900] mb-2">
                Comparison map
              </h2>
              <p className="text-sm text-[--color-text-muted] max-w-md">
                {competitors.length > 0
                  ? `${competitors.length} competitor${competitors.length === 1 ? '' : 's'} tracked. Every page built from structured, approved facts.`
                  : 'Structured competitor pages, each built from approved facts — not marketing copy.'}
              </p>
            </div>
            <Link
              href="/resources/compare"
              className="shrink-0 rounded-lg bg-[--color-brand-600] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--color-brand-700] transition-colors"
            >
              View comparison →
            </Link>
          </div>
        </section>
      </div>
    </>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[--color-border] px-6 py-10 text-center text-sm text-[--color-text-muted]">
      {label}
    </div>
  )
}
