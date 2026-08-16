import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role'],
    // Only admins see the Users collection in the sidebar
    hidden: ({ user }) => (user as any)?.role !== 'admin',
  },
  access: {
    // All authenticated users can read user documents (needed for relationship fields)
    read: ({ req }) => Boolean(req.user),
    // Only admin can create, update, or delete user accounts
    create: ({ req }) => (req.user as any)?.role === 'admin',
    update: ({ req }) => (req.user as any)?.role === 'admin',
    delete: ({ req }) => (req.user as any)?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Approver', value: 'approver' },
        { label: 'Reviewer', value: 'reviewer' },
        { label: 'Editor', value: 'editor' },
      ],
      admin: {
        position: 'sidebar',
        // Non-admins cannot see or change the role field
        condition: (_, __, { user }) => (user as any)?.role === 'admin',
      },
    },
  ],
}
