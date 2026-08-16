import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@/components/RichText'

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
  return {
    title: post.title,
    description: post.summary ?? undefined,
  }
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

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-[--color-border]">
        <div className="container py-3">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted]">
            <Link href="/resources" className="hover:text-[--color-text]">Resources</Link>
            <span>/</span>
            <span className="text-[--color-text] truncate max-w-xs">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-[--color-border]">
        <div className="container py-12 md:py-16 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">Blog</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] leading-tight mb-4">
            {post.title}
          </h1>
          {post.summary && (
            <p className="text-lg text-[--color-text-muted] leading-relaxed mb-6">{post.summary}</p>
          )}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[--color-text-muted]">
            {authorName && <span>By {authorName}</span>}
            {post.date && <span>{formatDate(post.date as string)}</span>}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {(post.tags as Array<{ tag: string }>).map((t, i) => (
                  <span key={i} className="rounded-full bg-[--color-brand-50] px-2.5 py-0.5 text-xs font-medium text-[--color-brand-700]">
                    {t.tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <article className="container py-12 max-w-3xl">
        {post.body ? (
          <RichText data={post.body as Parameters<typeof RichText>[0]['data']} />
        ) : (
          <p className="text-[--color-text-muted]">No content yet.</p>
        )}
      </article>

      {/* Back link */}
      <div className="border-t border-[--color-border]">
        <div className="container py-8">
          <Link href="/resources" className="text-sm font-medium text-[--color-brand-600] hover:underline">
            ← Back to Resources
          </Link>
        </div>
      </div>
    </>
  )
}
