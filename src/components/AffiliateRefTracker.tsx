'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { setAffiliateRefCookie } from '../utils/affiliate'

export default function AffiliateRefTracker() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const ref = searchParams.get('ref')
    if (!ref) return
    setAffiliateRefCookie(ref, 30)
  }, [searchParams])

  return null
}
