export type UserTier = 'AI_EXPLORER' | 'AI_ARCHITECT' | 'ENTERPRISE_AI'

export const USER_TIER_COOKIE = 'bwai_user_tier'
export const USER_ID_COOKIE = 'bwai_user_id'

export function normalizeUserTier(input: string | null | undefined): UserTier {
  const v = (input || '').trim().toUpperCase()
  if (v === 'AI_ARCHITECT') return 'AI_ARCHITECT'
  if (v === 'ENTERPRISE_AI') return 'ENTERPRISE_AI'
  return 'AI_EXPLORER'
}

export function tierLabel(tier: UserTier): string {
  if (tier === 'AI_ARCHITECT') return 'AI Architect'
  if (tier === 'ENTERPRISE_AI') return 'Enterprise AI'
  return 'AI Explorer'
}

export function domainMarkupPolicy(tier: UserTier): { percent: number; floorAdd: number } {
  // Only affects domains; SSL/LICENSE remain unchanged.
  if (tier === 'ENTERPRISE_AI') return { percent: 0, floorAdd: 0 }
  if (tier === 'AI_ARCHITECT') return { percent: 0.1, floorAdd: 2 }
  return { percent: 0.25, floorAdd: 5 }
}
