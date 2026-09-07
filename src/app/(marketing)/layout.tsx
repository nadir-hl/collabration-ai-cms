import type { Metadata } from 'next'
import { Poppins, Geist_Mono } from 'next/font/google'
import { draftMode } from 'next/headers'
import { DraftBanner } from '@/components/DraftBanner'
import React from 'react'
import '../globals.css'

// Poppins is not a variable font, so weights must be declared explicitly.
// The design uses Medium (500) for body and SemiBold (600) for headings/labels.
const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  display: 'swap',
})
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = {
  title: {
    template: '%s | Collaboration.AI',
    default: 'Collaboration.AI — AI for the full revenue cycle',
  },
  description:
    'Four connected AI products for the full revenue cycle: Source, Decide, Acquire, Intelligence.',
}

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraft } = await draftMode()
  return (
    <html lang="en" className={`${poppins.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <main className="flex-1">{children}</main>
        {isDraft && <DraftBanner />}
      </body>
    </html>
  )
}
