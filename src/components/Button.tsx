import Link from 'next/link'
import type { ComponentPropsWithoutRef } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost'
type Size = 'sm' | 'md' | 'lg' | 'xl'

type BaseProps = {
  variant?: Variant
  size?: Size
  className?: string
}

type ButtonAsButton = BaseProps &
  ComponentPropsWithoutRef<'button'> & { href?: never }

type ButtonAsLink = BaseProps &
  Omit<ComponentPropsWithoutRef<typeof Link>, 'href'> & { href: string }

type ButtonProps = ButtonAsButton | ButtonAsLink

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: ButtonProps) {
  const classes = `btn btn-${variant} btn-${size} ${className}`.trim()

  if ('href' in props && props.href !== undefined) {
    const { href, ...rest } = props as ButtonAsLink
    return <Link href={href} className={classes} {...rest} />
  }

  return <button className={classes} {...(props as ButtonAsButton)} />
}
