import { NextResponse } from 'next/server'
import { allProducts, allServices } from '../../../../lib/openprovider-products'

export const runtime = 'nodejs'

// MARZ Knowledge Base
interface KnowledgeItem {
  type: 'product' | 'service'
  id: string
  name: string
  category?: string
  description: string
  price?: string
  features: string[]
  benefits: string[]
  cta?: string
}

// Build knowledge base from products and services
const knowledgeBase: KnowledgeItem[] = [
  ...allProducts.map((p) => ({
    type: 'product' as const,
    id: p.id,
    name: p.name,
    category: p.category,
    description: p.description,
    price: p.pricing ? `${p.pricing.startingFrom} ${p.pricing.currency} ${p.pricing.period}` : undefined,
    features: p.features,
    benefits: p.benefits,
    cta: p.cta?.primary,
  })),
  ...allServices.map((s) => ({
    type: 'service' as const,
    id: s.id,
    name: s.name,
    description: s.description,
    features: s.features,
    benefits: s.benefits,
    cta: s.cta?.primary,
  })),
]

// Search knowledge base with keyword matching
function searchKnowledge(query: string): KnowledgeItem[] {
  const normalizedQuery = query.toLowerCase().trim()
  const queryWords = normalizedQuery.split(/\s+/).filter((w) => w.length > 2)

  const scored: { item: KnowledgeItem; score: number }[] = []

  for (const item of knowledgeBase) {
    let score = 0
    const searchText = [
      item.name.toLowerCase(),
      item.description.toLowerCase(),
      item.category?.toLowerCase() || '',
      ...item.features.map((f) => f.toLowerCase()),
      ...item.benefits.map((b) => b.toLowerCase()),
    ].join(' ')

    // Exact match bonus
    if (searchText.includes(normalizedQuery)) {
      score += 50
    }

    // Word matching
    for (const word of queryWords) {
      if (item.name.toLowerCase().includes(word)) {
        score += 20 // Name match is most important
      } else if (item.category?.toLowerCase().includes(word)) {
        score += 15
      } else if (searchText.includes(word)) {
        score += 5
      }
    }

    // Price-related queries
    if (
      (normalizedQuery.includes('price') ||
        normalizedQuery.includes('cost') ||
        normalizedQuery.includes('how much')) &&
      item.price
    ) {
      score += 10
    }

    if (score > 0) {
      scored.push({ item, score })
    }
  }

  // Sort by score and return top 3
  return scored.sort((a, b) => b.score - a.score).slice(0, 3).map((s) => s.item)
}

// Generate natural language response
function generateResponse(query: string, matches: KnowledgeItem[]): string {
  if (matches.length === 0) {
    return "I'm sorry, I couldn't find information on that topic. I can help you with questions about Domains, SSL Certificates, DNS Services, Email Security, Spam Experts, EasyDMARC, Licenses (Plesk & Virtuozzo), and our professional Services. What would you like to know?"
  }

  const [topMatch] = matches
  const queryLower = query.toLowerCase()

  // Price-specific response
  if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('how much')) {
    if (topMatch.price) {
      return `💰 **${topMatch.name}** starts from **${topMatch.price}**. ${topMatch.description} Would you like to know more about its features?`
    }
    return `**${topMatch.name}**: ${topMatch.description} Pricing information is available on the product page. Would you like me to tell you about its features?`
  }

  // Features question
  if (queryLower.includes('feature') || queryLower.includes('include') || queryLower.includes('offer')) {
    const featuresList = topMatch.features.slice(0, 5).join(', ')
    return `📋 **${topMatch.name}** includes: ${featuresList}. ${topMatch.benefits.length > 0 ? `Key benefits: ${topMatch.benefits.slice(0, 2).join(', ')}.` : ''}`
  }

  // General product info
  let response = `🤖 **${topMatch.name}**\n\n${topMatch.description}`

  if (topMatch.price) {
    response += `\n\n💵 Starting from: ${topMatch.price}`
  }

  if (topMatch.benefits.length > 0) {
    response += `\n\n✨ Key benefits:\n• ${topMatch.benefits.slice(0, 3).join('\n• ')}`
  }

  if (matches.length > 1) {
    response += `\n\nI also found related: ${matches.slice(1).map((m) => m.name).join(', ')}. Would you like to know more about any of these?`
  }

  return response
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const query = body?.query?.toString()?.trim()

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query' },
        { status: 400 }
      )
    }

    // Search knowledge base
    const matches = searchKnowledge(query)

    // Generate response
    const response = generateResponse(query, matches)

    return NextResponse.json({
      response,
      matches: matches.map((m) => ({
        id: m.id,
        name: m.name,
        type: m.type,
      })),
    })
  } catch (error) {
    console.error('[MARZ API Error]:', error)
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    )
  }
}
