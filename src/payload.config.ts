import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { buildConfig } from 'payload'
import path from 'path'
import sharp from 'sharp'
import { fileURLToPath } from 'url'

import { AuditLog } from './collections/AuditLog'
import { CaseStudies } from './collections/CaseStudies'
import { Competitors } from './collections/Competitors'
import { Media } from './collections/Media'
import { PageMeta } from './collections/PageMeta'
import { People } from './collections/People'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Redirects } from './collections/Redirects'
import { Users } from './collections/Users'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const SAMPLE_USERS = [
  { name: 'Alex Admin', email: 'admin@collaboration.ai', password: 'Admin@1234!', role: 'admin' },
  { name: 'Priya Approver', email: 'approver@collaboration.ai', password: 'Approver@1234!', role: 'approver' },
  { name: 'Ryan Reviewer', email: 'reviewer@collaboration.ai', password: 'Reviewer@1234!', role: 'reviewer' },
  { name: 'Emma Editor', email: 'editor@collaboration.ai', password: 'Editor@1234!', role: 'editor' },
]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeDashboard: [
        {
          path: '@/components/admin/DashboardStats',
          exportName: 'default',
        },
      ],
    },
    livePreview: {
      collections: ['posts', 'case-studies', 'competitors', 'products'],
      url: ({ data, collectionConfig }) => {
        const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
        const slug = String(data.slug ?? '')
        const secret = process.env.PREVIEW_SECRET ?? ''
        const secretParam = `secret=${encodeURIComponent(secret)}`

        const ROUTES: Record<string, string> = {
          'case-studies': `/resources/case-studies/${slug}`,
          competitors: `/resources/compare/${slug}`,
          products: `/products/${slug}`,
          posts: `/resources/${slug}`,
        }
        const redirect = ROUTES[collectionConfig?.slug ?? ''] ?? `/resources/${slug}`

        return `${base}/api/draft-enable?${secretParam}&redirect=${encodeURIComponent(redirect)}`
      },
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 812 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1280, height: 800 },
      ],
    },
  },
  collections: [
    Users,
    Posts,
    CaseStudies,
    Competitors,
    Products,
    People,
    Redirects,
    Media,
    PageMeta,
    AuditLog,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || 'change-this-secret-in-production',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: true },
    },
  }),
  sharp,
  onInit: async (payload) => {
    const { totalDocs } = await payload.find({ collection: 'users', limit: 0 })
    if (totalDocs === 0) {
      payload.logger.info('Seeding sample users...')
      for (const user of SAMPLE_USERS) {
        await payload.create({ collection: 'users', data: user })
      }
      payload.logger.info('Seeded 4 sample users (admin / approver / reviewer / editor)')
    }
  },
})
