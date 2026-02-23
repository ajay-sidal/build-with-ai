import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'
import { Index } from '@upstash/vector'
import { pipeline } from '@xenova/transformers'

export const runtime = 'edge'

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

// const groq = new Groq({ apiKey: process.env.GROQ_API_KEY }) // Moved to POST handler

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

export async function POST(req: Request) {
  try {
    // Check for GROQ API key
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey || groqApiKey.trim() === '') {
      console.error('[MARZ] GROQ_API_KEY is not configured')
      return NextResponse.json(
        {
          error: 'GROQ_API_KEY not configured',
          response: "I apologize, but MARZ is not fully configured yet. The GROQ_API_KEY environment variable is missing. Please contact the administrator to set up the AI service.",
          suggestions: ['What products do you offer?', 'Tell me about domains', 'What is SSL?'],
        },
        { status: 503 }
      )
    }

    const groq = new Groq({ apiKey: groqApiKey })

    // Parse request body
    const { messages } = await req.json()
    const userQuery = messages?.[messages.length - 1]?.content

    if (!userQuery) {
      return new Response('Missing user query', { status: 400 })
    }

    console.log('[MARZ] Processing query:', userQuery)

    // Check if we have Upstash Vector credentials
    const hasVectorDb = !!(process.env.UPSTASH_VECTOR_REST_URL && process.env.UPSTASH_VECTOR_REST_TOKEN)
    
    if (!hasVectorDb) {
      console.warn('[MARZ] Vector DB credentials not found. Using fallback response.')
      // Fallback to basic response if no vector DB
      return NextResponse.json({
        response: `I'm MARZ, your AI assistant for BUILD WITH AI. I can help you with:

**Products:**
- **Domain Registration** - Search and register domains with 1,500+ TLDs
- **SSL Certificates** - Secure your website with zero-knowledge SSL
- **DNS Hosting** - Fast, reliable DNS with instant propagation
- **Email Services** - Professional email with spam protection

What would you like to know more about?`,
        suggestions: ['Tell me about domain pricing', 'What SSL options are available?', 'How does DNS hosting work?'],
      })
    }

    // 1. Retrieval: Perform semantic search to get relevant context
    const contextItems = await semanticSearch(userQuery, 3)
    console.log('[MARZ] Found context items:', contextItems.length)

    // 2. Augmentation: Create a detailed prompt for the LLM
    const systemPrompt = `You are MARZ, a friendly and expert AI assistant for BUILD WITH AI, a futuristic domain and infrastructure provider.
- Your goal is to answer user questions accurately based on the provided context and conversation history.
- Be conversational, helpful, and slightly futuristic in your tone.
- Use markdown for formatting (bold, lists).
- If the context does not contain the answer, say you couldn't find the information and list the general topics you can help with.
- After answering the user's query, you MUST generate 2-3 relevant follow-up questions the user might have.
- You MUST format these suggestions as a JSON array string at the VERY END of your response, prefixed with "SUGGESTIONS:". For example: SUGGESTIONS:["What are its key features?", "How does pricing work?", "Compare it with other products"]`

    const contextString =
      contextItems.length > 0
        ? `Here is the relevant information:\n\n${contextItems
            .map(
              (item) =>
                `### ${item.name}\n**Description:** ${item.description}\n**Price:** ${item.price || 'N/A'}\n**Features:** ${item.features.join(', ')}\n**Benefits:** ${item.benefits.join(', ')}`
            )
            .join('\n\n')}`
        : 'No specific information was found for this query.'

    const finalMessages = [
      { role: 'system', content: `${systemPrompt}\n\nCONTEXT:\n${contextString}` },
      ...messages,
    ]

    // 3. Generation: Call the LLM with the complete prompt
    console.log('[MARZ] Calling Groq API...')
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: finalMessages,
      max_tokens: 1024,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
    console.log('[MARZ] Got response from Groq')

    // Parse suggestions from response
    let suggestions: string[] = []
    const suggestionMatch = aiResponse.match(/SUGGESTIONS:(\[.*\])/)
    if (suggestionMatch) {
      try {
        suggestions = JSON.parse(suggestionMatch[1])
      } catch {
        suggestions = []
      }
    }

    // Clean response text (remove SUGGESTIONS: part)
    const cleanResponse = aiResponse.replace(/SUGGESTIONS:\[.*\]/, '').trim()

    return NextResponse.json({
      response: cleanResponse,
      suggestions,
      matches: contextItems.map(item => ({
        id: item.id,
        name: item.name,
        type: item.type,
      })),
    })
  } catch (error) {
    console.error('[MARZ API Error]:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to process request',
        response: `I apologize, but I'm experiencing technical difficulties. Please try again. (Error: ${errorMessage})`,
        suggestions: ['Tell me about domains', 'What SSL options are available?', 'Help me choose a product'],
      },
      { status: 500 }
    )
  }
}
