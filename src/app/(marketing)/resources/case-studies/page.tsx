import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

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
      <section className="border-b border-[--color-border]">
        <div className="container py-14">
          <nav className="flex items-center gap-2 text-sm text-[--color-text-muted] mb-6">
            <Link href="/resources" className="hover:text-[--color-text]">Resources</Link>
            <span>/</span>
            <span className="text-[--color-text]">Case studies</span>
          </nav>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] mb-3">
            Customer stories
          </h1>
          <p className="text-[--color-text-muted] max-w-xl">
            How real teams use Collaboration.AI to source faster, qualify better, and close more.
          </p>
        </div>
      </section>

      <div className="container py-12">
        {docs.length === 0 ? (
          <div className="rounded-xl border border-dashed border-[--color-border] px-6 py-16 text-center text-sm text-[--color-text-muted]">
            No case studies published yet.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {docs.map((cs) => (
              <Link
                key={cs.id}
                href={`/resources/case-studies/${cs.slug}`}
                className="group flex flex-col rounded-xl border border-[--color-border] bg-white p-6 hover:border-[--color-brand-400] hover:shadow-[--shadow-card] transition-all"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-[--color-brand-500] mb-3">
                  Case study
                </p>
                <h2 className="text-lg font-bold text-[--color-text] group-hover:text-[--color-brand-700] mb-2 leading-snug">
                  {cs.client}
                </h2>
                {cs.mission && (
                  <p className="text-sm text-[--color-text-muted] line-clamp-3 leading-relaxed flex-1">
                    {cs.mission}
                  </p>
                )}
                <span className="mt-5 text-sm font-semibold text-[--color-brand-600]">Read story →</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
