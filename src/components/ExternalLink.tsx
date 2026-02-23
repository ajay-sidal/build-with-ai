import React from 'react'

type ExternalLinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: React.ReactNode
}

export default function ExternalLink({ href, children, target = '_blank', ...rest }: ExternalLinkProps) {
  const rel = rest.rel ?? (target === '_blank' ? 'noopener noreferrer' : undefined)
  return (
    <a href={href} target={target} rel={rel} {...rest}>
      {children}
    </a>
  )
}
