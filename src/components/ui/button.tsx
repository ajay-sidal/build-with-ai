import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        primary: 'bg-zinc-50 text-zinc-950 hover:bg-zinc-200',
        secondary: 'bg-zinc-900 text-zinc-50 hover:bg-zinc-800 border border-zinc-800',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
)

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { className?: string }

export function Button({ variant, className, ...props }: ButtonProps) {
  return <button className={clsx(buttonVariants({ variant }), className)} {...props} />
}

export { buttonVariants }
export type { ButtonProps }
