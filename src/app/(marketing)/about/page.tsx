import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'The team behind Collaboration.AI.',
}

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: team } = await payload.find({
    collection: 'people',
    where: { showOnTeamPage: { equals: true } },
    limit: 50,
  })

  return (
    <>
      {/* About */}
      <section className="border-b border-[--color-border]">
        <div className="container py-16 md:py-20 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">About</p>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] mb-6">
            We build AI for teams that sell
          </h1>
          {/* Replace with real about copy */}
          <div className="prose prose-neutral max-w-none text-[--color-text-muted] leading-relaxed space-y-4">
            <p>
              Collaboration.AI was built on the belief that the best revenue teams don't just move faster —
              they work smarter. Our products put AI where it actually helps: sourcing the right contacts,
              qualifying opportunities consistently, closing with the right intelligence, and tracking what
              the market is doing.
            </p>
            <p>
              Every claim our platform makes goes through a human approval gate before it ships.
              We believe in AI that drafts and humans that decide.
            </p>
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section id="team" className="border-b border-[--color-border] bg-[--color-bg-subtle]">
          <div className="container py-14">
            <h2 className="text-2xl font-bold text-[--color-brand-900] mb-10">The team</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
              {team.map((person) => (
                <div key={person.id} className="flex flex-col items-center text-center">
                  {person.photo && typeof person.photo === 'object' && 'url' in person.photo ? (
                    <Image
                      src={(person.photo as { url: string }).url}
                      alt={person.name}
                      width={80}
                      height={80}
                      className="rounded-full object-cover mb-3 w-20 h-20"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[--color-brand-50] flex items-center justify-center mb-3 text-[--color-brand-600] text-2xl font-bold">
                      {person.name[0]}
                    </div>
                  )}
                  <p className="text-sm font-semibold text-[--color-text]">{person.name}</p>
                  <p className="text-xs text-[--color-text-muted] mt-0.5">{person.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Careers CTA */}
      <section>
        <div className="container py-14">
          <div className="rounded-xl border border-[--color-border] bg-[--color-brand-50] p-8 md:p-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h2 className="text-xl font-bold text-[--color-brand-900] mb-1">We're hiring</h2>
              <p className="text-sm text-[--color-text-muted]">Join the team building AI for revenue.</p>
            </div>
            <Link
              href="/careers"
              className="shrink-0 rounded-lg border border-[--color-brand-600] px-5 py-2.5 text-sm font-semibold text-[--color-brand-600] hover:bg-[--color-brand-600] hover:text-white transition-colors"
            >
              See open roles →
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
