import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Args = {
  params: Promise<{ slug: string }>
}

async function getProduct(slug: string) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return {
    title: product.name,
    description: product.oneLiner ?? undefined,
  }
}

export async function generateStaticParams() {
  const slugs = ['source', 'decide', 'acquire', 'intelligence']
  return slugs.map((slug) => ({ slug }))
}

const otherProducts = [
  { name: 'Source', slug: 'source' },
  { name: 'Decide', slug: 'decide' },
  { name: 'Acquire', slug: 'acquire' },
  { name: 'Intelligence', slug: 'intelligence' },
]

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) notFound()

  const others = otherProducts.filter((p) => p.slug !== slug)

  return (
    <>
      {/* Hero */}
      <section className="border-b border-[--color-border]">
        <div className="container py-16 md:py-20">
          <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">
            Product
          </p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[--color-brand-900]">
            {product.name}
          </h1>
          {product.oneLiner && (
            <p className="mt-3 text-xl text-[--color-text-muted]">{product.oneLiner}</p>
          )}
          {product.whoItsFor && (
            <p className="mt-4 text-[--color-text-muted] max-w-xl leading-relaxed">{product.whoItsFor}</p>
          )}
          {product.callToAction?.label && product.callToAction?.url && (
            <Link
              href={product.callToAction.url}
              className="mt-8 inline-block rounded-lg bg-[--color-brand-600] px-6 py-3 text-sm font-semibold text-white hover:bg-[--color-brand-700] transition-colors"
            >
              {product.callToAction.label}
            </Link>
          )}
        </div>
      </section>

      {/* How it works with others — cross-product section */}
      {product.howItWorksWithOthers && (
        <section className="border-b border-[--color-border] bg-[--color-bg-subtle]">
          <div className="container py-12">
            <h2 className="text-lg font-semibold text-[--color-brand-900] mb-3">
              How {product.name} works with the platform
            </h2>
            <div className="prose prose-sm max-w-2xl text-[--color-text-muted]">
              {/* Rich text rendered as plain text for now — wire up lexical renderer next */}
              <p>{JSON.stringify(product.howItWorksWithOthers)}</p>
            </div>
          </div>
        </section>
      )}

      {/* Other products */}
      <section>
        <div className="container py-12">
          <h2 className="text-base font-semibold text-[--color-text-muted] mb-6">Also in the platform</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="rounded-lg border border-[--color-border] px-5 py-4 text-sm font-semibold text-[--color-text] hover:border-[--color-brand-400] hover:bg-[--color-bg-subtle] transition-all"
              >
                {p.name} →
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
