import * as React from 'react'
import clsx from 'clsx'

type DivProps = React.HTMLAttributes<HTMLDivElement>

export function Card({ className, ...props }: DivProps) {
  return <div className={clsx('rounded-xl border border-zinc-800 bg-zinc-950/60', className)} {...props} />
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={clsx('px-5 pt-5', className)} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={clsx('px-5 pb-5', className)} {...props} />
}
