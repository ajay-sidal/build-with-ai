import { NextResponse } from 'next/server'
import { Index } from '@upstash/vector'
import { pipeline } from '@xenova/transformers'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load .env.local for server-side execution
config({ path: resolve(process.cwd(), '.env.local') })

export const runtime = 'nodejs'

// Message interface for conversation history
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp?: string
}

// Knowledge item from vector DB
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
  searchText: string
}

// Initialize Upstash Vector client (singleton)
let vectorIndex: Index | null = null

function getVectorIndex(): Index | null {
  if (!vectorIndex) {
    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      return null
    }
    vectorIndex = new Index({
      url: process.env.UPSTASH_VECTOR_REST_URL,
      token: process.env.UPSTASH_VECTOR_REST_TOKEN,
    })
  }
  return vectorIndex
}

// Embedding model singleton (lazy loading)
let embeddingModel: any = null

async function getEmbeddingModel() {
  if (!embeddingModel) {
    embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
  }
  return embeddingModel
}

// Generate embedding for search query
async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = await getEmbeddingModel()
    const output = await model(text, { pooling: 'mean', normalize: true })
    const embedding384 = Array.from(output.data) as number[]
    
    // Pad to 1024 for Upstash compatibility
    const embedding1024 = new Array(1024).fill(0)
    embedding384.forEach((val: number, idx: number) => {
      embedding1024[idx] = val
    })
    
    return embedding1024
  } catch (error) {
    console.error('[MARZ] Embedding error:', error)
    return []
  }
}

// Semantic search with vector similarity
async function semanticSearch(query: string, topK: number = 3): Promise<KnowledgeItem[]> {
  try {
    const index = getVectorIndex()
    if (!index) return []

    const queryVector = await generateEmbedding(query)
    if (queryVector.length === 0) return []
    
    const results = await index.query({
      vector: queryVector,
      topK,
      includeMetadata: true,
    })

    return results.map((r: any) => r.metadata as KnowledgeItem).filter(Boolean)
  } catch (error) {
    console.error('[MARZ] Search error:', error)
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
    /\bfeatures\b/i,
    /\bprice\b/i,
    /\bcost\b/i,
    /\bincluded\b/i,
  ]
  const isShort = query.trim().split(/\s+/).length <= 5
  return followUpPatterns.some(pattern => pattern.test(query)) && isShort
}

// Extract context from conversation history
function extractContextFromHistory(history: Message[]): string {
  const lastAssistantMessage = history.slice().reverse().find(m => m.role === 'assistant')
  if (!lastAssistantMessage) return ''
  
  const content = lastAssistantMessage.content
  const boldMatches = content.match(/\*\*([^*]+)\*\*/g)
  if (boldMatches && boldMatches.length > 0) {
    return boldMatches[0].replace(/\*\*/g, '').trim()
  }
  return ''
}

// Generate response with conversation context
function generateResponse(query: string, history: Message[], matches: KnowledgeItem[]): { response: string; suggestions: string[] } {
  // Check if this is a follow-up query
  if (isFollowUpQuery(query) && history.length > 0) {
    const context = extractContextFromHistory(history)
    
    if (context && matches.length > 0) {
      const item = matches[0]
      const queryLower = query.toLowerCase()
      
      // Handle specific follow-up questions
      if (queryLower.includes('feature') || queryLower.includes('include') || queryLower.includes('offer')) {
        return {
          response: `📋 **${item.name}** includes:\n• ${item.features.slice(0, 5).join('\n• ')}\n\n${item.benefits.length > 0 ? `✨ Key benefits: ${item.benefits.slice(0, 2).join(', ')}.` : ''}`,
          suggestions: [
            `How much does ${item.name} cost?`,
            `What are the benefits of ${item.name}?`,
            `How do I get started with ${item.name}?`,
          ],
        }
      }
      
      if (queryLower.includes('price') || queryLower.includes('cost') || queryLower.includes('how much')) {
        if (item.price) {
          return {
            response: `💰 **${item.name}** starts from **${item.price}**. ${item.description.split('.')[0]}. Would you like to know about its features?`,
            suggestions: [
              `What features are included?`,
              `How does it compare to alternatives?`,
              `Can I upgrade later?`,
            ],
          }
        }
        return {
          response: `Pricing for **${item.name}** is available on the product page. ${item.description}`,
          suggestions: [
            `Tell me about features`,
            `What are the benefits?`,
            `How do I purchase?`,
          ],
        }
      }
      
      if (queryLower.includes('benefit') || queryLower.includes('why')) {
        return {
          response: `✨ **${item.name}** benefits:\n• ${item.benefits.slice(0, 4).join('\n• ')}\n\n${item.description}`,
          suggestions: [
            `What features does it have?`,
            `How much does it cost?`,
            `How do I get started?`,
          ],
        }
      }
      
      if (queryLower.includes('tell me more') || queryLower.includes('what about') || queryLower.includes('what else')) {
        return {
          response: `🤖 **${item.name}**\n\n${item.description}\n\n${item.price ? `💵 Starting from: ${item.price}\n\n` : ''}✨ Key features:\n• ${item.features.slice(0, 3).join('\n• ')}`,
          suggestions: [
            `What are the key features?`,
            `How much does it cost?`,
            `Show me related products`,
          ],
        }
      }
    }
  }

  // Not a follow-up, use semantic search results
  if (matches.length === 0) {
    return {
      response: "I'm here to help you with questions about our products and services! I can assist with:\n\n• **Domain Registration** - Find and register your perfect domain\n• **SSL Certificates** - Secure your website with DV, OV, EV, or Wildcard SSL\n• **DNS Services** - Free DNS hosting with global anycast network\n• **Email Security** - Spam Experts and EasyDMARC solutions\n• **Licenses** - Plesk and Virtuozzo control panel licenses\n\nWhat would you like to know?",
      suggestions: [
        "What domains do you offer?",
        "Tell me about SSL certificates",
        "How much does DNS hosting cost?",
      ],
    }
  }

  // General product info response
  const [topMatch, ...relatedMatches] = matches
  const queryLower = query.toLowerCase()

  let response = `🤖 **${topMatch.name}**\n\n${topMatch.description}`
  
  if (topMatch.price) {
    response += `\n\n💵 Starting from: ${topMatch.price}`
  }

  if (queryLower.includes('feature') || queryLower.includes('include')) {
    response += `\n\n📋 Key features:\n• ${topMatch.features.slice(0, 5).join('\n• ')}`
  }

  if (topMatch.benefits.length > 0) {
    response += `\n\n✨ Benefits:\n• ${topMatch.benefits.slice(0, 3).join('\n• ')}`
  }

  const suggestions = [
    `What are the features of ${topMatch.name}?`,
    `How much does ${topMatch.name} cost?`,
    relatedMatches.length > 0 ? `Tell me about ${relatedMatches[0].name}` : `Show me related products`,
  ]

  return { response, suggestions }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const query = body?.query?.toString()?.trim()
    const history: Message[] = body?.history || []

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    // Check if we have Upstash Vector credentials
    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      console.warn('[MARZ] Using fallback keyword search (no Upstash Vector credentials)')
      return NextResponse.json({
        response: 'MARZ is in setup mode. Vector DB credentials are not configured.',
        suggestions: ['What products do you offer?', 'Tell me about domains', 'What is SSL?'],
      }, { status: 500 })
    }

    // 1. Retrieval: Perform semantic search to get relevant context
    const contextItems = await semanticSearch(query, 3)

    // 2. Generation: Create response using conversation context
    const { response, suggestions } = generateResponse(query, history, contextItems)

    return NextResponse.json({
      response,
      matches: contextItems.map(m => ({ id: m.id, name: m.name, type: m.type })),
      suggestions,
    })

  } catch (error) {
    console.error('[MARZ API Error]:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process request', 
        response: "I apologize, but I'm experiencing technical difficulties. Please try again in a moment.",
        suggestions: ["Tell me about domains", "What SSL options are available?", "Help me choose a product"],
      },
      { status: 500 }
    )
  }
}
