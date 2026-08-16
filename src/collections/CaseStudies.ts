import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'client',
    defaultColumns: ['client', 'approver', 'status'],
  },
  versions: {
    drafts: true,
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
      name: 'approver',
      type: 'relationship',
      relationTo: 'people',
      required: true,
      admin: { position: 'sidebar' },
    },
  ],
}
