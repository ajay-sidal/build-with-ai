import * as React from 'react'
import clsx from 'clsx'

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { className?: string }

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={clsx('min-h-[120px] w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-zinc-200/20', className)}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'
