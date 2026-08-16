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
