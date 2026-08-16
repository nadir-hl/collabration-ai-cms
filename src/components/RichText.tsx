import { RichText as LexicalRichText } from '@payloadcms/richtext-lexical/react'

type Props = {
  data: Parameters<typeof LexicalRichText>[0]['data']
  className?: string
}

export function RichText({ data, className }: Props) {
  if (!data) return null
  return (
    <LexicalRichText
      data={data}
      className={className ?? 'rich-text'}
    />
  )
}
