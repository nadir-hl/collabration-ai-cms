import type { CollectionConfig } from 'payload'
import { isAdmin, isAuthenticated, publishedOrAuthenticated } from '../access/roles'
import { writeAuditLog } from '../hooks/writeAuditLog'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'reviewStatus', 'updatedAt'],
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
          throw new Error('Only approvers and admins can publish posts.')
        }
        return data
      },
    ],
    afterChange: [writeAuditLog('posts')],
  },
  fields: [
    {
      name: 'title',
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
      name: 'summary',
      type: 'textarea',
    },
    {
      name: 'body',
      type: 'richText',
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'people',
      admin: { position: 'sidebar' },
    },
    {
      name: 'date',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    {
      name: 'tags',
      type: 'array',
      fields: [{ name: 'tag', type: 'text' }],
    },
    {
      name: 'canonicalUrl',
      type: 'text',
      admin: { position: 'sidebar' },
    },
    {
      name: 'socialImage',
      type: 'upload',
      relationTo: 'media',
      admin: { position: 'sidebar' },
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
