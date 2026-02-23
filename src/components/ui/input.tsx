import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'

const inputVariants = cva(
  'h-12 w-full rounded-md border px-4 text-zinc-50 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-200/20',
  {
    variants: {
      variant: {
        default: 'border-zinc-800 bg-zinc-950 placeholder:text-zinc-500',
        ghost: 'border-transparent bg-transparent placeholder:text-zinc-500',
      },
      size: {
        default: 'h-12',
        sm: 'h-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants> & {
  className?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <input ref={ref} className={clsx(inputVariants({ variant, size }), className)} {...props} />
  },
)

Input.displayName = 'Input'
