import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'status', 'date'],
  },
  versions: {
    drafts: true,
  },
  access: {
    read: ({ req }) => req.user !== null || true, // public read for published
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
  ],
}
