import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with the Collaboration.AI team.',
}

export default function ContactPage() {
  return (
    <section>
      <div className="container py-16 md:py-20 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-widest text-[--color-brand-500] mb-3">Contact</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[--color-brand-900] mb-4">
          Talk to us
        </h1>
        <p className="text-[--color-text-muted] leading-relaxed mb-10">
          Tell us about your team and we'll show you the right products.
          We'll respond within one working day.
        </p>

        {/* HubSpot form embed — replace with your portal and form IDs */}
        {/*
          To embed:
          1. In HubSpot: Marketing → Forms → Share → Embed Code
          2. Paste the script tag below, keeping hbspt.forms.create() call
          3. Set portalId and formId from your HubSpot account
        */}
        <div
          id="hubspot-form"
          className="rounded-xl border border-[--color-border] bg-[--color-bg-subtle] p-8 text-center text-sm text-[--color-text-muted]"
        >
          <p className="font-medium mb-1">HubSpot form goes here</p>
          <p>Add your portal ID and form ID to embed the real form.</p>
          <p className="mt-3 text-xs">
            See <code className="bg-[--color-neutral-200] px-1 py-0.5 rounded">src/app/(marketing)/contact/page.tsx</code> for instructions.
          </p>
        </div>
      </div>
    </section>
  )
}
