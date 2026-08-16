import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Resources',
  description: 'Blog posts, case studies, and competitor research from Collaboration.AI.',
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
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
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-16 md:py-20">
          <div className="section-label mb-5">Resources</div>
          <h1 className="display-md max-w-2xl mb-4">
            Insights, research &amp; <span className="text-gradient">customer stories</span>
          </h1>
          <p className="text-body-lg text-[--color-text-muted] max-w-xl mb-8">
            Everything we publish — blog posts, customer stories, and competitor intelligence.
          </p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'All', href: '/resources' },
              { label: 'Blog', href: '/resources#blog' },
              { label: 'Case studies', href: '/resources/case-studies' },
              { label: 'Competitor map', href: '/resources/compare' },
            ].map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="rounded-full border border-[--color-border] bg-white px-4 py-1.5 text-sm font-medium text-[--color-text-muted] hover:border-[--color-brand-400] hover:text-[--color-text] transition-colors"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog posts */}
      <section id="blog" className="border-b border-[--color-border]">
        <div className="container py-14">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-4">Blog</div>
              <h2 className="display-md">Latest articles</h2>
            </div>
            {posts.length > 0 && (
              <Link href="/resources#blog" className="btn btn-outline btn-sm hidden sm:inline-flex">
                View all
              </Link>
            )}
          </div>

          {posts.length === 0 ? (
            <EmptyState label="No posts published yet." />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => {
                const coverImg =
                  post.socialImage && typeof post.socialImage === 'object' && 'url' in post.socialImage
                    ? (post.socialImage as { url: string }).url
                    : null
                return (
                  <Link
                    key={post.id}
                    href={`/resources/${post.slug}`}
                    className="group card card-hover flex flex-col overflow-hidden"
                    style={{ padding: 0 }}
                  >
                    {coverImg ? (
                      <div className="relative h-44 overflow-hidden">
                        <Image
                          src={coverImg}
                          alt={post.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                    ) : (
                      <div className="h-44 bg-gradient-to-br from-blue-50 to-slate-100" />
                    )}
                    <div className="p-6 flex flex-col flex-1">
                      <p className="text-xs text-[--color-text-muted] mb-3">
                        {post.date ? formatDate(post.date as string) : ''}
                      </p>
                      <h3 className="text-base font-semibold text-[--color-text] group-hover:text-[--color-brand-600] leading-snug mb-2 flex-1">
                        {post.title}
                      </h3>
                      {post.summary && (
                        <p className="text-sm text-[--color-text-muted] line-clamp-2 leading-relaxed mb-4">
                          {post.summary}
                        </p>
                      )}
                      <span className="text-sm font-semibold text-[--color-brand-600] flex items-center gap-1 group-hover:gap-2 transition-all duration-150">
                        Read more <ArrowRight size={14} aria-hidden />
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Case studies */}
      <section className="bg-glow-sides border-b border-[--color-border]">
        <div className="container py-14">
          <div className="flex items-end justify-between mb-10">
            <div>
              <div className="section-label mb-4">Customer stories</div>
              <h2 className="display-md">Case studies</h2>
            </div>
            {caseStudies.length > 0 && (
              <Link href="/resources/case-studies" className="btn btn-outline btn-sm hidden sm:inline-flex">
                View all
              </Link>
            )}
          </div>

          {caseStudies.length === 0 ? (
            <EmptyState label="No case studies published yet." />
          ) : (
            <div className="grid sm:grid-cols-2 gap-5">
              {caseStudies.map((cs) => (
                <Link
                  key={cs.id}
                  href={`/resources/case-studies/${cs.slug}`}
                  className="group card card-hover flex flex-col overflow-hidden"
                  style={{ padding: 0 }}
                >
                  <div className="h-1.5" style={{ background: 'linear-gradient(90deg, #2563eb, #22d3ee)' }} />
                  <div className="p-6 flex flex-col flex-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-[--color-brand-500] mb-3">
                      Case study
                    </p>
                    <h3 className="text-lg font-bold text-[--color-text] group-hover:text-[--color-brand-600] leading-snug mb-2">
                      {cs.client}
                    </h3>
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

      {/* Competitor map */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="section-label mb-5">Competitor intelligence</div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3">Comparison map</h2>
              <p className="text-base max-w-lg leading-relaxed text-[--color-text-muted]">
                {competitors.length > 0
                  ? `${competitors.length} competitor${competitors.length === 1 ? '' : 's'} tracked. Every page built from structured, approved facts — not marketing copy.`
                  : 'Structured competitor pages, each built from approved facts — not marketing copy.'}
              </p>
            </div>
            <Link href="/resources/compare" className="btn btn-primary btn-lg shrink-0">
              View comparison <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[--color-border] px-6 py-12 text-center text-sm text-[--color-text-muted]">
      {label}
    </div>
  )
}
