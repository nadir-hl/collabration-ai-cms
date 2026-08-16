import { draftMode } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const secret = searchParams.get('secret')
  const redirect = searchParams.get('redirect') ?? '/'

  const configuredSecret = process.env.PREVIEW_SECRET
  const isDev = process.env.NODE_ENV === 'development'

  // Require the secret in production; allow bypass only in dev when secret is unset
  if (configuredSecret) {
    if (secret !== configuredSecret) {
      return NextResponse.json({ error: 'Invalid preview secret' }, { status: 401 })
    }
  } else if (!isDev) {
    return NextResponse.json({ error: 'PREVIEW_SECRET is not configured' }, { status: 500 })
  }

  // Only allow relative redirects to prevent open-redirect abuse
  const target = redirect.startsWith('/') ? redirect : '/'
  ;(await draftMode()).enable()
  return NextResponse.redirect(new URL(target, req.url))
}
