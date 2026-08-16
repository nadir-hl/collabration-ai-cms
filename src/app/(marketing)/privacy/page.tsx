import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How Collaboration.AI collects, uses, and protects your information.',
}

const LAST_UPDATED = 'August 2025'

const sections = [
  '1. Who we are',
  '2. Information we collect',
  '3. How we use your information',
  '4. Sharing your information',
  '5. Data retention',
  '6. Your rights',
  '7. Security',
  '8. Third-party links',
  '9. Changes to this policy',
  '10. Contact us',
]

export default function PrivacyPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-[--color-border]" style={{ background: 'rgba(238,242,255,0.60)' }}>
        <div className="container py-14 max-w-5xl">
          <div className="section-label mb-5">Legal</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sm text-[--color-text-muted]">Last updated: {LAST_UPDATED}</p>
        </div>
      </header>

      {/* Body */}
      <div className="container py-12 md:py-16 max-w-5xl">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar TOC */}
          <aside className="lg:w-52 shrink-0">
            <div className="lg:sticky lg:top-24">
              <p className="text-xs font-bold uppercase tracking-widest text-[--color-text-muted] mb-4">
                Contents
              </p>
              <nav className="space-y-1">
                {sections.map((s) => {
                  const anchor = s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  return (
                    <a
                      key={s}
                      href={`#${anchor}`}
                      className="block text-sm text-[--color-text-muted] hover:text-[--color-brand-600] py-0.5 transition-colors"
                    >
                      {s}
                    </a>
                  )
                })}
              </nav>
            </div>
          </aside>

          {/* Article */}
          <article className="flex-1 space-y-10 text-[--color-text] min-w-0">

            <section id="1-who-we-are">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">1. Who we are</h2>
              <p className="text-[--color-text-muted] leading-relaxed">
                Collaboration.AI (&quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) operates the website at collaboration.ai and
                the associated platform services. This Privacy Policy explains how we collect, use,
                disclose, and safeguard your information when you visit our website or use our products.
                Please read this policy carefully. If you do not agree with its terms, please stop using
                the site.
              </p>
            </section>

            <section id="2-information-we-collect">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">2. Information we collect</h2>
              <p className="text-[--color-text-muted] leading-relaxed mb-4">
                We may collect information about you in the following ways:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[--color-text-muted] leading-relaxed">
                <li>
                  <strong className="text-[--color-text]">Information you provide directly.</strong>{' '}
                  When you fill in our contact form, request a demo, or communicate with us by email,
                  we collect the name, email address, company name, and message you submit.
                </li>
                <li>
                  <strong className="text-[--color-text]">Usage data.</strong>{' '}
                  We automatically collect certain information when you visit our site, including your IP
                  address, browser type, pages viewed, and the date and time of your visit.
                </li>
                <li>
                  <strong className="text-[--color-text]">Cookies and tracking technologies.</strong>{' '}
                  We use cookies and similar technologies to operate and improve our site. You can
                  control cookie settings through your browser preferences.
                </li>
              </ul>
            </section>

            <section id="3-how-we-use-your-information">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">3. How we use your information</h2>
              <p className="text-[--color-text-muted] leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2 text-[--color-text-muted] leading-relaxed">
                <li>Respond to your enquiries and provide the services you request</li>
                <li>Send you information about our products and services where you have opted in</li>
                <li>Improve and optimise our website and services</li>
                <li>Comply with legal obligations</li>
                <li>Detect and prevent fraudulent or abusive activity</li>
              </ul>
              <p className="text-[--color-text-muted] leading-relaxed mt-4">
                We do not sell your personal information to third parties.
              </p>
            </section>

            <section id="4-sharing-your-information">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">4. Sharing your information</h2>
              <p className="text-[--color-text-muted] leading-relaxed mb-4">We may share your information with:</p>
              <ul className="list-disc pl-6 space-y-2 text-[--color-text-muted] leading-relaxed">
                <li>
                  <strong className="text-[--color-text]">Service providers.</strong>{' '}
                  Third-party vendors who help us operate our website and business (such as hosting,
                  analytics, and email delivery), subject to confidentiality obligations.
                </li>
                <li>
                  <strong className="text-[--color-text]">Legal requirements.</strong>{' '}
                  Where required by law, court order, or governmental authority.
                </li>
                <li>
                  <strong className="text-[--color-text]">Business transfers.</strong>{' '}
                  In connection with a merger, acquisition, or sale of assets, where information may be
                  transferred as part of that transaction.
                </li>
              </ul>
            </section>

            <section id="5-data-retention">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">5. Data retention</h2>
              <p className="text-[--color-text-muted] leading-relaxed">
                We retain your personal information only as long as necessary to fulfil the purposes
                described in this policy, or as required by law. Contact form submissions are retained
                for up to two years unless you request deletion sooner.
              </p>
            </section>

            <section id="6-your-rights">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">6. Your rights</h2>
              <p className="text-[--color-text-muted] leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal
                information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-[--color-text-muted] leading-relaxed">
                <li>The right to access the personal information we hold about you</li>
                <li>The right to correct inaccurate or incomplete information</li>
                <li>The right to request deletion of your personal information</li>
                <li>The right to object to or restrict certain processing</li>
                <li>The right to data portability</li>
                <li>The right to withdraw consent at any time where processing is based on consent</li>
              </ul>
              <p className="text-[--color-text-muted] leading-relaxed mt-4">
                To exercise any of these rights, please contact us at{' '}
                <a href="mailto:privacy@collaboration.ai" className="text-[--color-brand-600] hover:underline">
                  privacy@collaboration.ai
                </a>.
              </p>
            </section>

            <section id="7-security">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">7. Security</h2>
              <p className="text-[--color-text-muted] leading-relaxed">
                We implement appropriate technical and organisational measures to protect your
                information against unauthorised access, loss, or misuse. However, no method of
                transmission over the internet or method of electronic storage is 100% secure.
              </p>
            </section>

            <section id="8-third-party-links">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">8. Third-party links</h2>
              <p className="text-[--color-text-muted] leading-relaxed">
                Our website may contain links to third-party websites. We are not responsible for the
                privacy practices of those sites and encourage you to read their privacy policies.
              </p>
            </section>

            <section id="9-changes-to-this-policy">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">9. Changes to this policy</h2>
              <p className="text-[--color-text-muted] leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material
                changes by posting the updated policy on this page with a revised &quot;last updated&quot; date.
                Your continued use of our site after any changes constitutes your acceptance of the
                updated policy.
              </p>
            </section>

            <section id="10-contact-us">
              <h2 className="text-lg font-bold text-[--color-text] mb-3">10. Contact us</h2>
              <p className="text-[--color-text-muted] leading-relaxed">
                If you have questions or concerns about this Privacy Policy, please contact us at{' '}
                <a href="mailto:privacy@collaboration.ai" className="text-[--color-brand-600] hover:underline">
                  privacy@collaboration.ai
                </a>{' '}
                or write to us at our registered address.
              </p>
            </section>

            <div className="pt-4 border-t border-[--color-border]">
              <Link href="/terms" className="text-sm text-[--color-brand-600] hover:underline">
                Read our Terms of Service <ArrowRight size={14} className="inline ml-0.5" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </>
  )
}
