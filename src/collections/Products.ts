import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrApprover, publishedOrAuthenticated } from '../access/roles'
import { writeAuditLog } from '../hooks/writeAuditLog'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'reviewStatus', 'approver', 'updatedAt'],
    hidden: ({ user }) => !['admin', 'approver', 'reviewer'].includes((user as { role?: string } | null)?.role),
    preview: (doc) => {
      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/draft-enable?secret=${encodeURIComponent(secret)}&redirect=${encodeURIComponent(`/products/${doc.slug}`)}`
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAuthenticated,
    create: isAdminOrApprover,
    update: isAdminOrApprover,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, req }) => {
        const role = (req.user as { role?: string } | null)?.role
        if (data._status === 'published' && !['admin', 'approver'].includes(role ?? '')) {
          throw new Error('Only approvers and admins can publish product pages.')
        }
        return data
      },
    ],
    afterChange: [writeAuditLog('products')],
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
      name: 'oneLiner',
      type: 'text',
      label: 'One-Line Description',
    },
    {
      name: 'whoItsFor',
      type: 'textarea',
    },
    {
      name: 'howItWorksWithOthers',
      type: 'richText',
      label: 'How It Works With the Other Products',
    },
    {
      name: 'proof',
      type: 'richText',
    },
    {
      name: 'callToAction',
      type: 'group',
      fields: [
        { name: 'label', type: 'text' },
        { name: 'url', type: 'text' },
      ],
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
          ['admin', 'approver', 'reviewer'].includes((req.user as { role?: string } | null)?.role ?? ''),
      },
    },
    {
      name: 'reviewer',
      type: 'relationship',
      relationTo: 'users',
      admin: { position: 'sidebar' },
      access: {
        update: ({ req }) => ['admin', 'approver'].includes((req.user as { role?: string } | null)?.role ?? ''),
      },
    },
    {
      name: 'approver',
      type: 'relationship',
      relationTo: 'people',
      admin: { position: 'sidebar' },
      access: {
        update: ({ req }) => ['admin', 'approver'].includes((req.user as { role?: string } | null)?.role ?? ''),
      },
    },
  ],
}
