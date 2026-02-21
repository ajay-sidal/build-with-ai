import * as React from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cx(
        'h-12 w-full rounded-md border border-zinc-800 bg-zinc-950 px-4 text-zinc-50',
        'placeholder:text-zinc-500',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200/20',
        className,
      )}
      {...props}
    />
  )
}
