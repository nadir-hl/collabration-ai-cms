import type { Metadata } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { Bot, LayoutGrid, Users, Briefcase, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Careers',
  description: 'Open roles at Collaboration.AI — join the team building AI for revenue teams.',
}

const values: Array<{ Icon: LucideIcon; title: string; body: string }> = [
  {
    Icon: Bot,
    title: 'AI drafts. Humans decide.',
    body: 'Every claim, every case study, every competitor page goes through a human approval gate. We build AI that helps, not AI that ships without oversight.',
  },
  {
    Icon: LayoutGrid,
    title: 'Small team, real ownership.',
    body: "You'll own your work end to end. No handoff theatre. If you ship it, you support it and improve it.",
  },
  {
    Icon: Users,
    title: 'Revenue teams are our users.',
    body: "We build for people who close deals. If it doesn't help someone source, qualify, or close — it doesn't ship.",
  },
]

export default async function CareersPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: openRoles } = await payload.find({
    collection: 'people',
    where: { isOpenRole: { equals: true } },
    limit: 50,
  })

  return (
    <>
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-20 md:py-24 max-w-3xl">
          <div className="section-label mb-6">Careers</div>
          <h1 className="display-lg mb-5">
            Help us build AI that revenue teams <span className="text-gradient">actually trust</span>
          </h1>
          <p className="text-body-lg text-[--color-text-muted]">
            We&apos;re a small team with a clear point of view: AI should draft, humans should decide.
            If that sounds right to you, we&apos;d like to meet you.
          </p>
        </div>
      </section>

      {/* Roles */}
      <section className="border-b border-[--color-border]">
        <div className="container py-14">
          {openRoles.length === 0 ? (
            <div className="max-w-xl">
              <div className="section-label mb-5">Open roles</div>
              <h2 className="display-md mb-4">No open roles right now</h2>
              <p className="text-body text-[--color-text-muted] mb-8">
                We don&apos;t have any listed positions at the moment, but we&apos;re always interested
                in hearing from people who care about honest AI and great revenue teams.
                Send us a note and tell us what you&apos;d build.
              </p>
              <Link href="/contact" className="btn btn-primary btn-lg">
                Get in touch
              </Link>
            </div>
          ) : (
            <>
              <div className="flex items-end justify-between mb-10">
                <div>
                  <div className="section-label mb-4">Open roles</div>
                  <h2 className="display-md">{openRoles.length} open position{openRoles.length !== 1 ? 's' : ''}</h2>
                </div>
              </div>
              <div className="space-y-4">
                {openRoles.map((person) => (
                  <div
                    key={person.id}
                    className="card card-hover flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-bold"
                        style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                      >
                        <Briefcase size={18} />
                      </div>
                      <div>
                        <h3 className="font-bold text-[--color-text] text-lg leading-snug mb-0.5">
                          {person.name}
                        </h3>
                        {person.bio && (
                          <p className="text-sm text-[--color-text-muted] leading-relaxed max-w-lg">
                            {person.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <Link href="/contact" className="btn btn-secondary btn-sm shrink-0">
                      Apply <ArrowRight size={14} />
                    </Link>
                  </div>
                ))}
              </div>

              <div className="mt-10 card card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 md:p-8">
                <div>
                  <p className="font-bold text-[--color-text] mb-1">Don&apos;t see the right role?</p>
                  <p className="text-sm text-[--color-text-muted]">Tell us what you&apos;d build. We read every note.</p>
                </div>
                <Link href="/contact" className="btn btn-outline btn-sm shrink-0">
                  Send a speculative application <ArrowRight size={14} />
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Values */}
      <section>
        <div className="container py-14">
          <div className="section-label mb-5">How we work</div>
          <h2 className="display-md mb-10">What you can expect</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {values.map((v) => (
              <div key={v.title} className="card">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl mb-5"
                  style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                >
                  <v.Icon size={20} />
                </div>
                <h3 className="font-bold text-[--color-text] mb-2 text-base">{v.title}</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-14">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-2xl font-bold mb-2">Ready to apply?</p>
              <p className="text-sm text-[--color-text-muted]">Reach out and tell us what you&apos;d build.</p>
            </div>
            <Link href="/contact" className="btn btn-primary btn-lg shrink-0">
              Get in touch <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
