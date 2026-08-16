import type { CollectionConfig } from 'payload'
import { isAdminOrApprover } from '../access/roles'

export const People: CollectionConfig = {
  slug: 'people',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'showOnTeamPage', 'isOpenRole'],
    // Only admin and approver manage the team and open roles
    hidden: ({ user }) => !['admin', 'approver'].includes((user as { role?: string } | null)?.role),
  },
  access: {
    read: () => true, // public — used for author display on posts and team page
    create: isAdminOrApprover,
    update: isAdminOrApprover,
    delete: isAdminOrApprover,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'linkedIn',
      type: 'text',
    },
    {
      name: 'showOnTeamPage',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'isOpenRole',
      type: 'checkbox',
      label: 'Open Role (careers page)',
      defaultValue: false,
      admin: { position: 'sidebar' },
    },
  ],
}
