import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated, publishedOrAuthenticated } from '../access/roles'
import { writeAuditLog } from '../hooks/writeAuditLog'

export const Competitors: CollectionConfig = {
  slug: 'competitors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'reviewStatus', 'approver', 'updatedAt'],
    preview: (doc) => {
      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/draft-enable?secret=${encodeURIComponent(secret)}&redirect=${encodeURIComponent(`/resources/compare/${doc.slug}`)}`
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const role = (req.user as any)?.role
        if (data._status === 'published' && !['admin', 'approver'].includes(role ?? '')) {
          throw new Error('Only approvers and admins can publish competitor pages.')
        }
        // Claim gate: cannot publish without a named approver
        if (data._status === 'published' && !data.approver) {
          throw new Error('A named approver is required before publishing a competitor page.')
        }
        return data
      },
    ],
    afterChange: [writeAuditLog('competitors')],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'positioning',
      type: 'textarea',
    },
    {
      name: 'facts',
      type: 'array',
      label: 'Fact Rows',
      fields: [
        { name: 'claim', type: 'text', label: 'Claim' },
        { name: 'ours', type: 'text', label: 'Our Position' },
        { name: 'theirs', type: 'text', label: 'Their Position' },
        { name: 'source', type: 'text', label: 'Source URL' },
        { name: 'date', type: 'date', label: 'Date Verified' },
      ],
    },
    {
      name: 'verdict',
      type: 'textarea',
    },
    {
      name: 'reviewStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Review', value: 'pending' },
        { label: 'In Review', value: 'in-review' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
      ],
      admin: { position: 'sidebar' },
      access: {
        update: ({ req }) =>
          ['admin', 'approver', 'reviewer'].includes((req.user as any)?.role ?? ''),
      },
    },
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
      access: {
        update: ({ req }) => ['admin', 'approver'].includes((req.user as any)?.role ?? ''),
      },
    },
    {
      name: 'approver',
      type: 'relationship',
      relationTo: 'people',
      admin: { position: 'sidebar' },
      access: {
        update: ({ req }) => ['admin', 'approver'].includes((req.user as any)?.role ?? ''),
      },
    },
  ],
}
