import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  ;(await draftMode()).disable()
  const referer = req.headers.get('referer')
  const target = referer?.startsWith(process.env.NEXT_PUBLIC_SERVER_URL ?? '') ? referer : '/'
  return NextResponse.redirect(new URL(target, req.url))
}
