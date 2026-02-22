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

// Initialize Upstash Vector client
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

// Embedding model singleton
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

// Semantic search with fallback to keyword matching
async function searchKnowledge(query: string, topK: number = 3): Promise<KnowledgeItem[]> {
  try {
    const index = getVectorIndex()
    if (!index) {
      console.warn('[MARZ] Vector DB not configured, using fallback')
      return []
    }

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

// Generate system prompt with RAG context
function buildSystemPrompt(matches: KnowledgeItem[], history: Message[], query: string): string {
  const context = matches.length > 0 
    ? matches.map(m => `
**${m.name}** (${m.type}${m.category ? ` - ${m.category}` : ''})
Description: ${m.description}
${m.price ? `Price: ${m.price}` : ''}
Features: ${m.features.slice(0, 5).join(', ')}
Benefits: ${m.benefits.slice(0, 3).join(', ')}
`).join('\n---\n')
    : 'No specific product information available.'

  const contextLabel = isFollowUpQuery(query) 
    ? `Previous context: ${extractContextFromHistory(history)}`
    : ''

  return `You are MARZ, a friendly and knowledgeable AI assistant for BuildWithAI.digital, a modern AI-native domain registrar and digital infrastructure platform.

Your role is to help users understand our products and services. Base your responses on the following context:

## Product/Service Context:
${context}
${contextLabel}

## Response Guidelines:
1. Be conversational, friendly, and helpful
2. Keep responses concise (2-4 sentences max)
3. Use emojis sparingly (🤖 💰 ✨ 📋)
4. Highlight key info with **bold** text
5. If you don't know something, admit it and suggest contacting support
6. Always stay on topic - only discuss domains, SSL, DNS, email security, licenses, and related services
7. If the query is unrelated to our products, politely redirect

## Follow-up Handling:
- If the user asks a follow-up question, use the previous context to provide a specific answer
- For "tell me more", expand on features and benefits
- For "how much" or "price", provide pricing if available

## Suggestion Chips:
At the END of your response, add exactly 3 follow-up question suggestions in this exact format:
SUGGESTIONS:["Question 1?","Question 2?","Question 3?"]

Choose suggestions that:
- Are relevant to the current topic
- Help users discover related products/services
- Are short and actionable (5-8 words each)
`
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)
    const query = body?.query?.toString()?.trim()
    const history: Message[] = body?.history || []

    if (!query) {
      return NextResponse.json({ error: 'Missing query' }, { status: 400 })
    }

    // Check if Groq API key is configured
    if (!process.env.GROQ_API_KEY) {
      // Fallback to basic response
      const matches = await searchKnowledge(query)
      if (matches.length === 0) {
        return NextResponse.json({
          response: "🤖 MARZ is in setup mode. Please configure GROQ_API_KEY in your environment variables to enable LLM-powered responses. For now, I can help with basic questions about Domains, SSL, DNS, and Licenses.",
          matches: [],
          setupRequired: true,
        })
      }
    }

    // Search for relevant products/services (RAG retrieval)
    const matches = await searchKnowledge(query)

    // Build system prompt with context
    const systemPrompt = buildSystemPrompt(matches, history, query)

    // If Groq is configured, use LLM for response generation
    if (process.env.GROQ_API_KEY) {
      try {
        const { Groq } = await import('groq-sdk')
        
        const groq = new Groq({
          apiKey: process.env.GROQ_API_KEY,
        })

        const chatCompletion = await groq.chat.completions.create({
          messages: [
            { role: 'system', content: systemPrompt },
            ...history.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: query },
          ],
          model: 'llama3-8b-8192',
          temperature: 0.7,
          max_tokens: 500,
          top_p: 1,
          stream: false,
        })

        const response = chatCompletion.choices[0]?.message?.content || ''

        // Parse suggestions from response
        let suggestions: string[] = []
        const suggestionMatch = response.match(/SUGGESTIONS:(\[.*\])/)
        if (suggestionMatch) {
          try {
            suggestions = JSON.parse(suggestionMatch[1])
          } catch {
            suggestions = []
          }
        }

        // Remove suggestions from response text
        const cleanResponse = response.replace(/SUGGESTIONS:\[.*\]/, '').trim()

        return NextResponse.json({
          response: cleanResponse,
          matches: matches.map(m => ({ id: m.id, name: m.name, type: m.type })),
          suggestions,
        })
      } catch (groqError) {
        console.error('[MARZ] Groq API error:', groqError)
        // Fall through to fallback response
      }
    }

    // Fallback: Generate response without LLM
    if (matches.length === 0) {
      return NextResponse.json({
        response: "I'm here to help you with questions about our products and services! I can assist with:\n\n• **Domain Registration** - Find and register your perfect domain\n• **SSL Certificates** - Secure your website with DV, OV, EV, or Wildcard SSL\n• **DNS Services** - Free DNS hosting with global anycast network\n• **Email Security** - Spam Experts and EasyDMARC solutions\n• **Licenses** - Plesk and Virtuozzo control panel licenses\n\nWhat would you like to know?",
        matches: [],
        suggestions: [
          "What domains do you offer?",
          "Tell me about SSL certificates",
          "How much does DNS hosting cost?",
        ],
      })
    }

    // Simple template-based response for fallback
    const [topMatch] = matches
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
      `Tell me about related products`,
    ]

    return NextResponse.json({
      response,
      matches: matches.map(m => ({ id: m.id, name: m.name, type: m.type })),
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
