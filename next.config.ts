import type { NextConfig } from 'next'
import { withPayload } from '@payloadcms/next/withPayload'

const nextConfig: NextConfig = {
  // Payload needs this to resolve its config alias
}

export default withPayload(nextConfig)
