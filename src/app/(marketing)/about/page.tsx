import type { Metadata } from 'next'
import { Bot, LayoutGrid, Users, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Image from 'next/image'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'The team behind Collaboration.AI.',
}

const values: Array<{ Icon: LucideIcon; title: string; body: string }> = [
  {
    Icon: Bot,
    title: 'AI drafts. Humans decide.',
    body: "Every claim, case study, and competitor page goes through a named approver. AI accelerates; people stay accountable.",
  },
  {
    Icon: LayoutGrid,
    title: 'Structured over intuitive.',
    body: "Great revenue decisions aren't guesses — they're the result of the right criteria applied at the right moments, every time.",
  },
  {
    Icon: Users,
    title: 'Revenue teams are our users.',
    body: "We build for people who close deals. If it doesn't help someone source, qualify, or close — it doesn't ship.",
  },
]

export default async function AboutPage() {
  const payload = await getPayload({ config: configPromise })
  const { docs: team } = await payload.find({
    collection: 'people',
    where: { showOnTeamPage: { equals: true } },
    limit: 50,
  })

  return (
    <>
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-20 md:py-24 max-w-3xl">
          <div className="section-label mb-6">About us</div>
          <h1 className="display-lg mb-6">
            We build AI for teams <br className="hidden md:block" />
            that <span className="text-gradient">sell smarter</span>
          </h1>
          <div className="space-y-4 text-body-lg text-[--color-text-muted]">
            <p>
              Collaboration.AI was built on the belief that the best revenue teams don&apos;t just move
              faster — they work smarter. Our products put AI where it actually helps: sourcing
              the right contacts, qualifying opportunities consistently, closing with the right
              intelligence, and tracking what the market is doing.
            </p>
            <p>
              Every claim our platform makes goes through a human approval gate before it ships.
              We believe in AI that drafts and humans that decide.
            </p>
          </div>
        </div>
      </section>

      {/* Values strip */}
      <section className="border-b border-[--color-border]">
        <div className="container py-14">
          <div className="grid sm:grid-cols-3 gap-px bg-[--color-border] rounded-2xl overflow-hidden">
            {values.map((v) => (
              <div key={v.title} className="bg-white p-8">
                <span className="text-[--color-brand-500] mb-4 block" aria-hidden>
                  <v.Icon size={24} />
                </span>
                <h3 className="text-base font-bold text-[--color-text] mb-2">{v.title}</h3>
                <p className="text-sm text-[--color-text-muted] leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      {team.length > 0 && (
        <section id="team" className="bg-glow-sides border-b border-[--color-border]">
          <div className="container py-16">
            <div className="section-label mb-5">The team</div>
            <h2 className="display-md mb-12">Meet the people<br className="hidden md:block" /> building it</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {team.map((person) => (
                <div key={person.id} className="group flex flex-col items-center text-center">
                  {person.photo && typeof person.photo === 'object' && 'url' in person.photo ? (
                    <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden ring-2 ring-[--color-border] group-hover:ring-[--color-brand-400] transition-all duration-200">
                      <Image
                        src={(person.photo as { url: string }).url}
                        alt={person.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4 text-[--color-brand-600] text-2xl font-bold ring-2 ring-[--color-border] group-hover:ring-[--color-brand-400] transition-all" style={{ background: '#EEF2FF' }}>
                      {person.name[0]}
                    </div>
                  )}
                  <p className="text-sm font-semibold text-[--color-text] mb-0.5">{person.name}</p>
                  {person.role && (
                    <p className="text-xs text-[--color-text-muted]">{person.role}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Careers CTA */}
      <section className="border-t border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-16 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="section-label mb-5">We&apos;re hiring</div>
              <h2 className="text-3xl font-bold mb-3">Join the team</h2>
              <p className="text-base max-w-md leading-relaxed text-[--color-text-muted]">
                Help us build AI that revenue teams can actually trust. Small team, real ownership,
                and a clear point of view.
              </p>
            </div>
            <Link href="/careers" className="btn btn-primary btn-lg shrink-0">
              See open roles <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
