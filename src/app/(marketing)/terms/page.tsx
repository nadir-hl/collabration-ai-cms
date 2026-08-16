import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing your use of Collaboration.AI and its products.',
}

const LAST_UPDATED = 'August 2025'

export default function TermsPage() {
  return (
    <>
      {/* Header */}
      <header className="border-b border-[--color-border] bg-[--color-brand-900]">
        <div className="container py-14 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[--color-brand-300] mb-3">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">Terms of Service</h1>
          <p className="text-sm text-[--color-brand-400]">Last updated: {LAST_UPDATED}</p>
        </div>
      </header>

      {/* Body */}
      <article className="container py-12 md:py-16 max-w-3xl space-y-10 text-[--color-text]">

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">1. Acceptance of terms</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            By accessing or using collaboration.ai (the "Site") or any of our products (the
            "Services"), you agree to be bound by these Terms of Service ("Terms"). If you do not
            agree to these Terms, you may not access or use the Site or Services. These Terms
            constitute a legally binding agreement between you and Collaboration.AI.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">2. Use of the services</h2>
          <p className="text-[--color-text-muted] leading-relaxed mb-4">
            You agree to use the Services only for lawful purposes and in accordance with these
            Terms. You agree not to:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-[--color-text-muted] leading-relaxed">
            <li>Use the Services in any way that violates applicable law or regulation</li>
            <li>
              Attempt to gain unauthorised access to any part of the Services, its related
              systems, or networks
            </li>
            <li>
              Transmit any material that is unlawful, harmful, defamatory, or otherwise
              objectionable
            </li>
            <li>
              Use automated means (bots, scrapers, crawlers) to access or collect data from
              the Services without our prior written permission
            </li>
            <li>Interfere with or disrupt the integrity or performance of the Services</li>
            <li>
              Reproduce, duplicate, copy, sell, or exploit any portion of the Services without
              express written permission from us
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">3. Accounts</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            Where the Services require you to create an account, you are responsible for
            maintaining the confidentiality of your credentials and for all activity that occurs
            under your account. You agree to notify us immediately of any unauthorised use of your
            account. We reserve the right to terminate accounts that violate these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">4. Intellectual property</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            The Site and Services, including all content, features, and functionality (including
            but not limited to text, graphics, logos, and software), are owned by Collaboration.AI
            or its licensors and are protected by copyright, trademark, and other intellectual
            property laws. You may not reproduce, modify, distribute, or create derivative works
            from any content on the Site without our express written consent.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">5. User content</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            Where the Services allow you to submit, post, or share content ("User Content"), you
            retain ownership of that content. By submitting User Content, you grant us a
            worldwide, non-exclusive, royalty-free licence to use, reproduce, and display that
            content solely to operate and improve the Services. You represent and warrant that you
            own or have the necessary rights to your User Content and that it does not infringe
            the rights of any third party.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">
            6. Disclaimer of warranties
          </h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
            EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY,
            FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE
            SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL
            COMPONENTS.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">
            7. Limitation of liability
          </h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            TO THE FULLEST EXTENT PERMITTED BY LAW, COLLABORATION.AI SHALL NOT BE LIABLE FOR ANY
            INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR
            RELATED TO YOUR USE OF THE SERVICES, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY
            OF SUCH DAMAGES. OUR TOTAL LIABILITY TO YOU FOR ANY CLAIMS ARISING UNDER THESE TERMS
            SHALL NOT EXCEED THE AMOUNT YOU PAID US IN THE TWELVE MONTHS PRECEDING THE CLAIM, OR
            ONE HUNDRED DOLLARS ($100), WHICHEVER IS GREATER.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">8. Third-party services</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            The Services may contain links to third-party websites or integrate with third-party
            services. We are not responsible for the content or practices of those third parties.
            Your use of third-party services is governed by their own terms and privacy policies.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">9. Termination</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            We reserve the right to suspend or terminate your access to the Services at our sole
            discretion, without notice, for conduct that we believe violates these Terms or is
            harmful to other users, us, third parties, or the integrity of the Services.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">10. Governing law</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            These Terms shall be governed by and construed in accordance with the laws of the
            State of Delaware, United States, without regard to its conflict of law provisions.
            Any disputes arising under these Terms shall be subject to the exclusive jurisdiction
            of the courts located in Delaware.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">
            11. Changes to these terms
          </h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            We may update these Terms from time to time. We will notify you of material changes
            by posting the updated Terms with a revised "last updated" date. Your continued use
            of the Services after any changes constitutes your acceptance of the updated Terms.
            We encourage you to review these Terms periodically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-[--color-brand-900] mb-3">12. Contact us</h2>
          <p className="text-[--color-text-muted] leading-relaxed">
            If you have any questions about these Terms, please contact us at{' '}
            <a href="mailto:legal@collaboration.ai" className="text-[--color-brand-600] hover:underline">
              legal@collaboration.ai
            </a>.
          </p>
        </section>
      </article>
    </>
  )
}
