import type { CollectionConfig } from 'payload'
import { isAdmin, isAdminOrApprover } from '../access/roles'

export const PageMeta: CollectionConfig = {
  slug: 'page-meta',
  admin: {
    useAsTitle: 'path',
    defaultColumns: ['path', 'title', 'robots', 'updatedAt'],
    description: 'SEO overrides for static pages (home, about, contact, etc.). Content-collection pages handle their own metadata.',
    hidden: ({ user }) => !['admin', 'approver'].includes((user as { role?: string } | null)?.role),
  },
  access: {
    read: () => true,
    create: isAdminOrApprover,
    update: isAdminOrApprover,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'path',
      type: 'text',
      required: true,
      unique: true,
      label: 'Page Path',
      admin: {
        description: 'URL path this metadata applies to, e.g. / or /about or /contact',
      },
    },
    {
      name: 'title',
      type: 'text',
      label: 'Meta Title',
      admin: {
        description: 'Overrides the default page title tag',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Meta Description',
    },
    {
      name: 'canonical',
      type: 'text',
      label: 'Canonical URL',
      admin: {
        description: 'Full URL (https://…). Leave blank to use the page URL.',
      },
    },
    {
      name: 'robots',
      type: 'select',
      defaultValue: 'index, follow',
      options: [
        { label: 'Index, Follow (default)', value: 'index, follow' },
        { label: 'No Index', value: 'noindex, follow' },
        { label: 'No Index, No Follow', value: 'noindex, nofollow' },
      ],
      admin: { position: 'sidebar' },
    },
    {
      name: 'schemaType',
      type: 'select',
      label: 'Schema.org Type',
      admin: { position: 'sidebar' },
      options: [
        { label: 'WebPage', value: 'WebPage' },
        { label: 'FAQPage', value: 'FAQPage' },
        { label: 'Article', value: 'Article' },
        { label: 'Organization', value: 'Organization' },
        { label: 'Product', value: 'Product' },
      ],
    },
    {
      name: 'ogImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Social / OG Image',
      admin: { position: 'sidebar' },
    },
  ],
}
