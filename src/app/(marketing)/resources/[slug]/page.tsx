import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@/components/RichText'
import { ArrowLeft } from 'lucide-react'

type Args = { params: Promise<{ slug: string }> }

async function getPost(slug: string, draft: boolean) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'posts',
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
  const post = await getPost(slug, false)
  if (!post) return {}
  return { title: post.title, description: post.summary ?? undefined }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default async function PostPage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()
  const post = await getPost(slug, isDraft)
  if (!post) notFound()

  const authorName =
    post.author && typeof post.author === 'object' && 'name' in post.author
      ? (post.author as { name: string }).name
      : null

  const authorPhoto =
    post.author && typeof post.author === 'object' && 'photo' in post.author &&
    typeof (post.author as { photo?: unknown }).photo === 'object' &&
    (post.author as { photo?: unknown }).photo &&
    'url' in ((post.author as { photo?: unknown }).photo as object)
      ? ((post.author as { photo: { url: string } }).photo.url)
      : null

  const coverImg =
    post.socialImage && typeof post.socialImage === 'object' && 'url' in post.socialImage
      ? (post.socialImage as { url: string }).url
      : null

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[--color-border]">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted]">
            <Link href="/resources" className="hover:text-[--color-text] transition-colors">Resources</Link>
            <span>/</span>
            <span className="text-[--color-text] truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <header className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-14 md:py-18 max-w-3xl">
          <div className="section-label mb-5">Blog</div>
          <h1 className="display-md leading-tight mb-5">{post.title}</h1>
          {post.summary && (
            <p className="text-body-lg text-[--color-text-muted] mb-6">{post.summary}</p>
          )}

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-4">
            {authorName && (
              <div className="flex items-center gap-2">
                {authorPhoto ? (
                  <div className="relative w-7 h-7 rounded-full overflow-hidden">
                    <Image src={authorPhoto} alt={authorName} fill className="object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                  >
                    {authorName[0]}
                  </div>
                )}
                <span className="text-sm font-medium text-[--color-text]">{authorName}</span>
              </div>
            )}
            {post.date && (
              <span className="text-sm text-[--color-text-muted]">{formatDate(post.date as string)}</span>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {(post.tags as Array<{ tag: string }>).map((t, i) => (
                  <span
                    key={i}
                    className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ background: '#EEF2FF', color: 'var(--color-brand-700)' }}
                  >
                    {t.tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Cover image */}
      {coverImg && (
        <div className="border-b border-[--color-border]">
          <div className="container max-w-3xl py-8">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden">
              <Image src={coverImg} alt={post.title} fill className="object-cover" priority />
            </div>
          </div>
        </div>
      )}

      {/* Article body */}
      <article className="container py-12 md:py-16 max-w-3xl">
        {post.body ? (
          <div className="rich-text">
            <RichText data={post.body as Parameters<typeof RichText>[0]['data']} />
          </div>
        ) : (
          <p className="text-[--color-text-muted]">No content yet.</p>
        )}
      </article>

      {/* Bottom CTA */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-14 md:py-16 max-w-3xl">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <p className="text-lg font-bold mb-1">Want to see this in practice?</p>
              <p className="text-sm text-[--color-text-muted]">Talk to us about your team&apos;s pipeline.</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/resources" className="btn btn-outline btn-sm">
                <ArrowLeft size={14} /> More articles
              </Link>
              <Link href="/contact" className="btn btn-primary btn-sm">Talk to us</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
