import * as React from 'react'

type DivProps = React.HTMLAttributes<HTMLDivElement>

function cx(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(' ')
}

export function Card({ className, ...props }: DivProps) {
  return (
    <div
      className={cx('rounded-xl border border-zinc-800 bg-zinc-950/60', className)}
      {...props}
    />
  )
}

export function CardHeader({ className, ...props }: DivProps) {
  return <div className={cx('px-5 pt-5', className)} {...props} />
}

export function CardContent({ className, ...props }: DivProps) {
  return <div className={cx('px-5 pb-5', className)} {...props} />
}
