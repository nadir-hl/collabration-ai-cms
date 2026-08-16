import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Open roles at Collaboration.AI — join the team building AI for revenue teams.',
}

export default async function CareersPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: openRoles } = await payload.find({
    collection: 'people',
    where: { isOpenRole: { equals: true } },
    limit: 50,
  })

  return (
    <>
      {/* Header */}
      <section className="border-b border-[--color-border]">
        <div className="container py-16 md:py-20 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">
            Careers
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] mb-6">
            Help us build AI that revenue teams trust
          </h1>
          <p className="text-lg text-[--color-text-muted] leading-relaxed">
            We're a small team with a clear point of view: AI should draft, humans should decide.
            If that sounds right to you, we'd like to meet you.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="container py-14">
        {openRoles.length === 0 ? (
          <div className="max-w-xl">
            <h2 className="text-xl font-bold text-[--color-brand-900] mb-3">
              No open roles right now
            </h2>
            <p className="text-[--color-text-muted] leading-relaxed mb-6">
              We don't have any listed positions at the moment, but we're always interested
              in hearing from people who care about honest AI and great revenue teams.
              Send us a note and tell us what you'd build.
            </p>
            <Link
              href="/contact"
              className="inline-block rounded-lg bg-[--color-brand-600] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[--color-brand-700] transition-colors"
            >
              Get in touch
            </Link>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-[--color-brand-900] mb-8">
              Open roles ({openRoles.length})
            </h2>
            <div className="divide-y divide-[--color-border] border-y border-[--color-border]">
              {openRoles.map((person) => (
                <div
                  key={person.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-6"
                >
                  <div>
                    <h3 className="font-semibold text-[--color-text] text-lg leading-snug">
                      {person.name}
                    </h3>
                    {person.bio && (
                      <p className="text-sm text-[--color-text-muted] mt-1 max-w-xl leading-relaxed">
                        {person.bio}
                      </p>
                    )}
                  </div>
                  <Link
                    href="/contact"
                    className="shrink-0 rounded-lg border border-[--color-brand-600] px-4 py-2 text-sm font-semibold text-[--color-brand-600] hover:bg-[--color-brand-600] hover:text-white transition-colors"
                  >
                    Apply →
                  </Link>
                </div>
              ))}
            </div>

            {/* Speculative applications */}
            <div className="mt-12 rounded-xl border border-[--color-border] bg-[--color-bg-subtle] p-6 md:p-8 max-w-2xl">
              <p className="font-semibold text-[--color-brand-900] mb-1">
                Don't see the right role?
              </p>
              <p className="text-sm text-[--color-text-muted] mb-4">
                Tell us what you'd build. We read every note.
              </p>
              <Link
                href="/contact"
                className="text-sm font-semibold text-[--color-brand-600] hover:underline"
              >
                Send a speculative application →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Values strip */}
      <section className="border-t border-[--color-border] bg-[--color-bg-subtle]">
        <div className="container py-14">
          <h2 className="text-xl font-bold text-[--color-brand-900] mb-8">How we work</h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: 'AI drafts. Humans decide.',
                body: 'Every claim, every case study, every competitor page goes through a human approval gate. We build AI that helps, not AI that ships without oversight.',
              },
              {
                title: 'Small team, real ownership.',
                body: "You'll own your work end to end. No handoff theatre. If you ship it, you support it, you improve it.",
              },
              {
                title: 'Revenue teams are our users.',
                body: 'We build for people who close deals. That keeps us honest. If it doesn\'t help someone source, qualify, or close — it doesn\'t ship.',
              },
            ].map((v) => (
              <div key={v.title} className="rounded-xl border border-[--color-border] bg-white p-6">
                <h3 className="font-semibold text-[--color-brand-900] mb-2">{v.title}</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
