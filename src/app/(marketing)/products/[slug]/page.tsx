import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { draftMode } from 'next/headers'
import Link from 'next/link'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { RichText } from '@/components/RichText'
import { ScanSearch, GitBranch, TrendingUp, Brain, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Args = { params: Promise<{ slug: string }> }

async function getProduct(slug: string, draft: boolean) {
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    draft,
    overrideAccess: draft,
    limit: 1,
  })
  return result.docs[0] ?? null
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug, false)
  if (!product) return {}
  return { title: product.name, description: product.oneLiner ?? undefined }
}

export async function generateStaticParams() {
  return ['source', 'decide', 'acquire', 'intelligence'].map((slug) => ({ slug }))
}

const allProducts: Array<{ name: string; slug: string; Icon: LucideIcon }> = [
  { name: 'Source', slug: 'source', Icon: ScanSearch },
  { name: 'Decide', slug: 'decide', Icon: GitBranch },
  { name: 'Acquire', slug: 'acquire', Icon: TrendingUp },
  { name: 'Intelligence', slug: 'intelligence', Icon: Brain },
]

export default async function ProductPage({ params }: Args) {
  const { slug } = await params
  const { isEnabled: isDraft } = await draftMode()
  const product = await getProduct(slug, isDraft)
  if (!product) notFound()

  const others = allProducts.filter((p) => p.slug !== slug)

  return (
    <>
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-20 md:py-24 max-w-3xl">
          <div className="section-label mb-5">Product</div>
          <h1 className="display-lg mb-4">{product.name}</h1>
          {product.oneLiner && (
            <p className="text-body-lg text-[--color-brand-500] font-semibold mb-4">
              {product.oneLiner}
            </p>
          )}
          {product.whoItsFor && (
            <p className="text-body-lg text-[--color-text-muted] max-w-xl mb-8">
              {product.whoItsFor}
            </p>
          )}
          {product.callToAction?.label && product.callToAction?.url && (
            <Link href={product.callToAction.url} className="btn btn-primary btn-lg">
              {product.callToAction.label} <ArrowRight size={16} />
            </Link>
          )}
        </div>
      </section>

      {/* How it works with others */}
      {product.howItWorksWithOthers && (
        <section className="border-b border-[--color-border]">
          <div className="container py-12 md:py-16 max-w-3xl">
            <div className="section-label mb-4">Platform integration</div>
            <h2 className="text-2xl font-bold text-[--color-text] mb-6">
              How {product.name} works with the platform
            </h2>
            <div className="rich-text">
              <RichText data={product.howItWorksWithOthers as Parameters<typeof RichText>[0]['data']} />
            </div>
          </div>
        </section>
      )}

      {/* Proof */}
      {product.proof && (
        <section className="border-b border-[--color-border]">
          <div className="container py-12 md:py-16 max-w-3xl">
            <div className="section-label mb-4">Why it works</div>
            <h2 className="text-2xl font-bold text-[--color-text] mb-6">The evidence</h2>
            <div className="rich-text">
              <RichText data={product.proof as Parameters<typeof RichText>[0]['data']} />
            </div>
          </div>
        </section>
      )}

      {/* Other products */}
      <section>
        <div className="container py-12">
          <p className="text-sm font-semibold text-[--color-text-muted] uppercase tracking-widest mb-6">
            Also in the platform
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {others.map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="group card card-hover flex items-center gap-3"
              >
                <span
                  className="shrink-0 text-[--color-brand-500]"
                  aria-hidden
                >
                  <p.Icon size={18} />
                </span>
                <span className="font-semibold text-[--color-text] group-hover:text-[--color-brand-600] transition-colors">
                  {p.name}
                </span>
                <ArrowRight size={14} className="ml-auto text-[--color-text-muted] group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
