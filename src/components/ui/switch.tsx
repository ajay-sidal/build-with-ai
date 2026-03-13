import * as React from 'react'
import clsx from 'clsx'

type SwitchProps = React.InputHTMLAttributes<HTMLInputElement> & {
  className?: string
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, checked, defaultChecked, onChange, ...props }, ref) => {
    return (
      <label className={clsx('inline-flex items-center cursor-pointer', className)}>
        <input
          ref={ref}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={onChange}
          {...props}
          className="sr-only"
        />
        <span
          aria-hidden
          className={clsx(
            'relative inline-block h-5 w-9 rounded-full transition-colors',
            checked || defaultChecked ? 'bg-emerald-500' : 'bg-zinc-700'
          )}
        >
          <span
            className={clsx(
              'absolute left-0 top-0 h-5 w-5 translate-x-0 transform rounded-full bg-white shadow transition-transform',
              checked || defaultChecked ? 'translate-x-4' : 'translate-x-0'
            )}
          />
        </span>
      </label>
    )
  }
)

Switch.displayName = 'Switch'

export default Switch
