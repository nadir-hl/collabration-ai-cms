import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated, publishedOrAuthenticated, editorOwnsOrAdmin } from '../access/roles'
import { writeAuditLog } from '../hooks/writeAuditLog'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'reviewStatus', 'approver', 'updatedAt'],
    preview: (doc) => {
      const base = process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000'
      const secret = process.env.PREVIEW_SECRET ?? ''
      return `${base}/api/draft-enable?secret=${encodeURIComponent(secret)}&redirect=${encodeURIComponent(`/resources/case-studies/${doc.slug}`)}`
    },
  },
  versions: {
    drafts: true,
  },
  access: {
    read: publishedOrAuthenticated,
    create: isAuthenticated,
    update: editorOwnsOrAdmin,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        if (operation === 'create' && req.user) {
          data.createdBy = req.user.id
        }
        return data
      },
      ({ data, req }) => {
        const role = (req.user as { role?: string } | null)?.role
        if (data._status === 'published' && !['admin', 'approver'].includes(role ?? '')) {
          throw new Error('Only approvers and admins can publish case studies.')
        }
        return data
      },
    ],
    afterChange: [writeAuditLog('case-studies')],
  },
  fields: [
    {
      name: 'client',
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
      name: 'mission',
      type: 'textarea',
    },
    {
      name: 'problem',
      type: 'richText',
    },
    {
      name: 'whatWeDid',
      type: 'richText',
    },
    {
      name: 'outcome',
      type: 'richText',
    },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'text', type: 'textarea' },
        { name: 'attribution', type: 'text' },
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
    {
      name: 'createdBy',
      type: 'relationship',
      relationTo: 'users',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Auto-set on create. Editors can only edit their own documents.',
      },
    },
  ],
}
