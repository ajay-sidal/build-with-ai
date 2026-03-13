import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import clsx from 'clsx'

const selectVariants = cva(
  'w-full appearance-none rounded-md border px-3 pr-8 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-200/20',
  {
    variants: {
      variant: {
        default: 'border-zinc-700 bg-zinc-800 text-white',
      },
      size: {
        default: 'h-10',
        sm: 'h-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & VariantProps<typeof selectVariants> & {
  className?: string
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, variant, size, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select ref={ref} className={clsx(selectVariants({ variant, size }), className)} {...props}>
        {children}
      </select>
      {/* Arrow icon placeholder */}
      <svg className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6"/></svg>
    </div>
  )
})

Select.displayName = 'Select'
