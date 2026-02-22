import { NextResponse } from 'next/server'
import { Index } from '@upstash/vector'
import { pipeline } from '@xenova/transformers'

export const runtime = 'nodejs'

// Message interface for conversation history
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

// Knowledge item metadata from vector DB
interface KnowledgeItem {
  id: string
  name: string
  type: 'product' | 'service'
  category?: string
  description: string
  price?: string
  features: string[]
  benefits: string[]
  cta?: string
}

// Initialize Upstash Vector client lazily
let vectorIndex: Index | null = null

function getVectorIndex(): Index {
  if (!vectorIndex) {
    vectorIndex = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })
  }
  return vectorIndex
}

// Singleton for embedding model (lazy loading)
let embeddingModel: any = null

async function getEmbeddingModel() {
  if (!embeddingModel) {
    embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embeddingModel
}

// Generate embedding for a query
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getEmbeddingModel()
    const output = await model(text, { pooling: 'mean', normalize: true })
    return Array.from(output.data) as number[]
  } catch (error) {
    console.error('[MARZ] Error generating embedding:', error)
    throw error
  }
}

// Semantic search using vector similarity
async function semanticSearch(query: string, topK: number = 3): Promise<KnowledgeItem[]> {
  try {
    const index = getVectorIndex()
    const queryVector = await generateEmbedding(query)
    
    const results = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    })

    return results.map((r: any) => r.metadata as KnowledgeItem).filter(Boolean)
  } catch (error) {
    console.error('[MARZ] Semantic search error:', error)
    return []
  }
}

// Detect if query is a follow-up question
function isFollowUpQuery(query: string): boolean {
  const followUpPatterns = [
    /\btell me more\b/i,
    /\bwhat (about|else)\b/i,
    /\bhow (much|many|about)\b/i,
    /\bwhat (are|is|about)\b/i,
    /\bcan (you|i)\b/i,
    /\bdoes (it|that)\b/i,
    /\bis (it|that)\b/i,
    /\bfeatures\b/i,
    /\bprice\b/i,
    /\bcost\b/i,
    /\bcheaper\b/i,
    /\bincluded\b/i,
    /\bcomes with\b/i,
  ]

  // Short queries are more likely follow-ups
  const isShort = query.trim().split(/\s+/).length <= 4
  
  return followUpPatterns.some(pattern => pattern.test(query)) && isShort
}

// Extract product/service ID from conversation history
function extractContextFromHistory(history: Message[]): KnowledgeItem | null {
  // Look at the last assistant message
  const lastAssistantMessage = history.slice().reverse().find(m => m.role === 'assistant')
  
  if (!lastAssistantMessage) return null

  // Try to extract product name from the message
  const content = lastAssistantMessage.content
  
  // Look for bold text (product names are bolded)
  const boldMatches = content.match(/\*\*([^*]+)\*\*/g)
  if (boldMatches && boldMatches.length > 0) {
    // The first bold text is usually the product name
    const productName = boldMatches[0].replace(/\*\*/g, '').trim()
    return { id: productName.toLowerCase().replace(/\s+/g, '-'), name: productName } as KnowledgeItem
  }

  return null
}

// Generate response with conversation context
function generateResponse(
  query: string,
  history: Message[],
  matches: KnowledgeItem[]
): string {
  // Check if this is a follow-up query
  if (isFollowUpQuery(query) && history.length > 0) {
    const context = extractContextFromHistory(history)
    
    if (context && matches.length > 0) {
      // Use the context from history to provide a specific answer
      const item = matches[0]
      
      // Handle specific follow-up questions
      const queryLower = query.toLowerCase()
      
      if (queryLower.includes('feature') || queryLower.includes('include') || queryLower.includes('offer')) {
        const featuresList = item.features.slice(0, 5).join(', ')
        return `📋 **${item.name}** includes:\n• ${item.features.slice(0, 5).join('\n• ')}\n\n${item.benefits.length > 0 ? `✨ Key benefits: ${item.benefits.slice(0, 2).join(', ')}.` : ''}`
      }
      
      if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('how much') || queryLower.includes('cheaper')) {
        if (item.price) {
          return `💰 **${item.name}** starts from **${item.price}**. ${item.description.split('.')[0]}. Would you like to know about its features?`
        }
        return `Pricing for **${item.name}** is available on the product page. ${item.description}`
      }
      
      if (queryLower.includes('benefit') || queryLower.includes('why')) {
        return `✨ **${item.name}** benefits:\n• ${item.benefits.slice(0, 4).join('\n• ')}\n\n${item.description}`
      }
      
      if (queryLower.includes('tell me more') || queryLower.includes('what about') || queryLower.includes('what else')) {
        return `🤖 **${item.name}**\n\n${item.description}\n\n${item.price ? `💵 Starting from: ${item.price}\n\n` : ''}✨ Key features:\n• ${item.features.slice(0, 3).join('\n• ')}`
      }
    }
  }

  // Not a follow-up, use semantic search results
  if (matches.length === 0) {
    return "I'm sorry, I couldn't find information on that topic. I can help you with questions about:\n\n• Domain Registration & Transfer\n• SSL Certificates (DV, OV, EV, Wildcard)\n• DNS Services & Premium DNS\n• Email Security & Spam Experts\n• EasyDMARC\n• Plesk & Virtuozzo Licenses\n\nWhat would you like to know?"
  }

  const [topMatch, ...relatedMatches] = matches
  const queryLower = query.toLowerCase()

  // Price-specific response
  if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('how much')) {
    if (topMatch.price) {
      return `💰 **${topMatch.name}** starts from **${topMatch.price}**. ${topMatch.description} Would you like to know more about its features?`
    }
    return `**${topMatch.name}**: ${topMatch.description}\n\nPricing information is available on the product page. Would you like me to tell you about its features?`
  }

  // Features question
  if (queryLower.includes('feature') || queryLower.includes('include') || queryLower.includes('offer')) {
    return `📋 **${topMatch.name}** includes:\n• ${topMatch.features.slice(0, 5).join('\n• ')}\n\n${topMatch.benefits.length > 0 ? `✨ Key benefits: ${topMatch.benefits.slice(0, 2).join(', ')}.` : ''}`
  }

  // General product info
  let response = `🤖 **${topMatch.name}**\n\n${topMatch.description}`

  if (topMatch.price) {
    response += `\n\n💵 Starting from: ${topMatch.price}`
  }

  if (topMatch.benefits.length > 0) {
    response += `\n\n✨ Key benefits:\n• ${topMatch.benefits.slice(0, 3).join('\n• ')}`
  }

  if (relatedMatches.length > 0) {
    response += `\n\n🔍 Related: ${relatedMatches.map(m => m.name).join(', ')}. Would you like to know more about any of these?`
  }

  return response
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const query = body?.query?.toString()?.trim()
    const history: Message[] = body?.history || []

    if (!query) {
      return NextResponse.json(
        { error: 'Missing query' },
        { status: 400 }
      )
    }

    // Check if we have Upstash Vector credentials
    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      // Fallback to basic keyword matching if no vector DB
      console.warn('[MARZ] Using fallback keyword search (no Upstash Vector credentials)')
      return NextResponse.json({
        response: "⚠️ MARZ is in setup mode. Please configure Upstash Vector credentials (UPSTASH_VECTOR_REST_URL and UPSTASH_VECTOR_REST_TOKEN) in your environment variables, then run `npm run db:seed-vectors` to enable semantic search.",
        matches: [],
        setupRequired: true,
      })
    }

    // Perform semantic search
    const matches = await semanticSearch(query, 3)

    // Generate response with conversation context
    const response = generateResponse(query, history, matches)

    return NextResponse.json({
      response,
      matches: matches.map(m => ({
        id: m.id,
        name: m.name,
        type: m.type,
        category: m.category,
      })),
    })
  } catch (error) {
    console.error('[MARZ API Error]:', error)
    return NextResponse.json(
      { error: 'Failed to process request', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
