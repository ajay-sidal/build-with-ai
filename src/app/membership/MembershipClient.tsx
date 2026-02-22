'use client'

import * as React from 'react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader } from '../../components/ui/card'
import { normalizeUserTier, tierLabel, USER_TIER_COOKIE, type UserTier } from '../../utils/membership'

type TierCard = {
  tier: UserTier
  price: string
  bullets: string[]
}

const TIERS: TierCard[] = [
  {
    tier: 'AI_EXPLORER',
    price: '$0/mo',
    bullets: ['Standard domain markup (25%)', 'Access to dynamic promos', 'Alpha discounts when available'],
  },
  {
    tier: 'AI_ARCHITECT',
    price: '$19/mo',
    bullets: ['Lower domain markup (10%)', 'Annual .digital credit (coming soon)', 'Priority onboarding'],
  },
  {
    tier: 'ENTERPRISE_AI',
    price: '$99/mo',
    bullets: ['Wholesale domain pricing (0% markup)', 'Priority AI Design support', 'Dedicated escalation path'],
  },
]

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`
}

export default function MembershipClient() {
  const [tier, setTier] = React.useState<UserTier>('AI_EXPLORER')
  const [saved, setSaved] = React.useState(false)

  React.useEffect(() => {
    const m = document.cookie.match(new RegExp(`${USER_TIER_COOKIE}=([^;]+)`))
    const current = m ? decodeURIComponent(m[1] || '') : ''
    setTier(normalizeUserTier(current))
  }, [])

  function save(next: UserTier) {
    setTier(next)
    setCookie(USER_TIER_COOKIE, next)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1500)
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TIERS.map((t) => {
        const active = tier === t.tier
        return (
          <Card key={t.tier} className={active ? 'border-zinc-700' : undefined}>
            <CardHeader>
              <div className="text-xs uppercase tracking-widest text-zinc-500">{tierLabel(t.tier)}</div>
              <div className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100">{t.price}</div>
            </CardHeader>
            <CardContent className="pt-4">
              <ul className="space-y-2 text-sm text-zinc-300">
                {t.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center justify-between">
                <Button
                  type="button"
                  variant={active ? 'primary' : 'secondary'}
                  onClick={() => save(t.tier)}
                  className="h-10"
                >
                  {active ? 'Selected' : 'Select tier'}
                </Button>

                {active && saved ? (
                  <div className="text-xs text-emerald-300">Saved</div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
