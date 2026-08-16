import type { CollectionConfig } from 'payload'

export const Products: CollectionConfig = {
  slug: 'products',
  admin: {
    useAsTitle: 'name',
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
  ],
}
