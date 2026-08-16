import { draftMode } from 'next/headers'
import { Footer } from '@/components/Footer'
import { Nav } from '@/components/Nav'
import { DraftBanner } from '@/components/DraftBanner'
import React from 'react'

export default async function MarketingLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled: isDraft } = await draftMode()
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
      {isDraft && <DraftBanner />}
    </>
  )
}
