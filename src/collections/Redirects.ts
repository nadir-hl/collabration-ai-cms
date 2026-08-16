import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrApprover } from '../access/roles'

export const Redirects: CollectionConfig = {
  slug: 'redirects',
  admin: {
    useAsTitle: 'from',
    defaultColumns: ['from', 'to', 'statusCode', 'retired'],
    // Redirect management is an admin/approver concern
    hidden: ({ user }) => !['admin', 'approver'].includes((user as { role?: string } | null)?.role),
  },
  access: {
    read: isAdminOrApprover,
    create: isAdminOrApprover,
    update: isAdminOrApprover,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'from',
      type: 'text',
      required: true,
      unique: true,
      label: 'From Path',
    },
    {
      name: 'to',
      type: 'text',
      required: true,
      label: 'To Path or URL',
    },
    {
      name: 'statusCode',
      type: 'select',
      defaultValue: '301',
      options: [
        { label: '301 Permanent', value: '301' },
        { label: '302 Temporary', value: '302' },
        { label: '410 Gone', value: '410' },
        { label: '404 Not Found', value: '404' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'decisionNote',
      type: 'textarea',
      label: 'Decision Note',
    },
    {
      name: 'retired',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
