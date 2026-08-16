import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { draftMode } from 'next/headers'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { DraftBanner } from '@/components/DraftBanner'
import React from 'react'
import '../globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full flex flex-col antialiased">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
        {isDraft && <DraftBanner />}
      </body>
    </html>
  )
}
