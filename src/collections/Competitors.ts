import type { CollectionConfig } from 'payload'

export const Competitors: CollectionConfig = {
  slug: 'competitors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'approver', 'updatedAt'],
  },
  versions: {
    drafts: true,
  },
  access: {
    // Claims must never publish without a named approver
    update: ({ req, data }) => {
      if (!req.user) return false
      return true
    },
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'update' && data._status === 'published') {
          if (!data.approver) {
            throw new Error('A named approver is required before publishing a competitor page.')
          }
        }
        return data
      },
    ],
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
      name: 'approver',
      type: 'relationship',
      relationTo: 'people',
      admin: { position: 'sidebar' },
    },
  ],
}
