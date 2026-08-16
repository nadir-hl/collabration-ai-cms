import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Mail, Scale, MessageSquare, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Collaboration.AI team.',
}

const details: Array<{ label: string; value: string; Icon: LucideIcon }> = [
  { label: 'Response time', value: 'Within one working day', Icon: Clock },
  { label: 'Sales queries', value: 'hello@collaboration.ai', Icon: Mail },
  { label: 'Privacy &amp; legal', value: 'legal@collaboration.ai', Icon: Scale },
]

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-glow-hero border-b border-[--color-border]">
        <div className="container py-14 md:py-16">
          <div className="section-label mb-5">Contact</div>
          <h1 className="display-md mb-4">
            Talk to us about <span className="text-gradient">your pipeline</span>
          </h1>
          <p className="text-body-lg text-[--color-text-muted] max-w-xl">
            Tell us about your team and we&apos;ll show you the right products.
          </p>
        </div>
      </section>

      {/* Content */}
      <section>
        <div className="container py-14">
          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16">

            {/* Left: info */}
            <div>
              <h2 className="text-xl font-bold text-[--color-text] mb-6">
                What to expect
              </h2>
              <div className="space-y-6 mb-10">
                {details.map((d) => (
                  <div key={d.label} className="flex items-start gap-4">
                    <div
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base"
                      style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                    >
                      <d.Icon size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-[--color-text-muted] mb-0.5">
                        {d.label}
                      </p>
                      <p
                        className="text-sm font-medium text-[--color-text]"
                        dangerouslySetInnerHTML={{ __html: d.value }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-[--color-border] p-6 bg-[--color-bg-subtle]">
                <p className="text-xs font-semibold uppercase tracking-wider text-[--color-brand-500] mb-3">
                  Already a customer?
                </p>
                <p className="text-sm text-[--color-text-muted] leading-relaxed mb-4">
                  Log in to your account or reach out to your dedicated contact — we&apos;ll route
                  your message to the right person.
                </p>
                <Link href="/get-started" className="text-sm font-semibold text-[--color-brand-600] hover:underline">
                  Log in <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Right: form */}
            <div>
              {/*
                To embed a HubSpot form:
                1. In HubSpot: Marketing → Forms → Share → Embed Code
                2. Add the script tag and hbspt.forms.create() call
                3. Set portalId and formId from your HubSpot account
              */}
              <div className="card">
                <h2 className="text-lg font-bold text-[--color-text] mb-2">Send us a message</h2>
                <p className="text-sm text-[--color-text-muted] mb-8">
                  We&apos;ll respond within one working day.
                </p>
                <div
                  id="hubspot-form"
                  className="rounded-xl border border-dashed border-[--color-border] px-6 py-16 text-center text-sm text-[--color-text-muted]"
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-lg"
                    style={{ background: '#EEF2FF', color: 'var(--color-brand-600)' }}
                  >
                    <MessageSquare size={20} />
                  </div>
                  <p className="font-semibold text-[--color-text] mb-1">HubSpot form</p>
                  <p className="text-xs text-[--color-text-muted] max-w-xs mx-auto">
                    Add your portal ID and form ID to{' '}
                    <code className="bg-[--color-neutral-100] px-1 py-0.5 rounded text-xs">
                      contact/page.tsx
                    </code>{' '}
                    to embed the real form.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust bar */}
      <section className="border-t border-[--color-border] bg-[--color-bg-subtle]">
        <div className="container py-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-[--color-text-muted] text-center mb-6">
            Trusted by revenue teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-40 grayscale">
            {['Vertex Partners', 'Meridian Capital', 'Apex Revenue', 'Frontier Sales', 'Atlas Group'].map((name) => (
              <span key={name} className="text-sm font-bold text-[--color-neutral-600] tracking-wide">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
