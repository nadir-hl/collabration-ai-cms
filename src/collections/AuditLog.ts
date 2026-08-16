import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminApproverOrReviewer } from '../access/roles'

export const AuditLog: CollectionConfig = {
  slug: 'audit-log',
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'action', 'collection', 'user', 'createdAt'],
    hidden: ({ user }) => !['admin', 'approver', 'reviewer'].includes((user as any)?.role),
  },
  access: {
    read: isAdminApproverOrReviewer,
    create: () => false,
    update: () => false,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'summary',
      type: 'text',
      required: true,
    },
    {
      name: 'action',
      type: 'select',
      required: true,
      options: [
        { label: 'Created', value: 'create' },
        { label: 'Updated', value: 'update' },
        { label: 'Published', value: 'publish' },
        { label: 'Unpublished', value: 'unpublish' },
        { label: 'Deleted', value: 'delete' },
      ],
    },
    {
      name: 'collection',
      type: 'text',
    },
    {
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
  ],
}
