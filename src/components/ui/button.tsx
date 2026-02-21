import * as React from 'react'

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary'
}

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cx(
        'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200/20',
        'disabled:pointer-events-none disabled:opacity-50',
        variant === 'primary'
          ? 'bg-zinc-50 text-zinc-950 hover:bg-zinc-200'
          : 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 border border-zinc-800',
        className,
      )}
      {...props}
    />
  )
}
