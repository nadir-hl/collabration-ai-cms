import type { ComponentPropsWithoutRef } from 'react'

type CardProps = ComponentPropsWithoutRef<'div'> & {
  variant?: 'default' | 'subtle'
  hover?: boolean
}

export function Card({
  variant = 'default',
  hover = true,
  className = '',
  children,
  ...props
}: CardProps) {
  const classes = [
    'card',
    variant === 'subtle' ? 'card-subtle' : '',
    hover ? 'card-hover' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  )
}
