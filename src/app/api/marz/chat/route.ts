import { NextResponse } from 'next/server'
import { OpenAIStream, StreamingTextResponse } from 'ai'
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

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

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
    // Vercel AI SDK reads the body
    const { messages } = await req.json()
    const userQuery = messages[messages.length - 1]?.content

    if (!userQuery) {
      return new Response('Missing user query', { status: 400 })
    }

    // Check if we have Upstash Vector credentials
    if (!process.env.UPSTASH_VECTOR_REST_URL || !process.env.UPSTASH_VECTOR_REST_TOKEN) {
      // Fallback to basic keyword matching if no vector DB
      console.warn('[MARZ] Using fallback keyword search (no Upstash Vector credentials)')
      return NextResponse.json({
        response: 'MARZ is in setup mode. Vector DB credentials are not configured.',
        suggestions: ['What products do you offer?', 'Tell me about domains', 'What is SSL?'],
      }, { status: 500 })
    }

    // 1. Retrieval: Perform semantic search to get relevant context
    const contextItems = await semanticSearch(userQuery, 3)

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

    // 3. Generation: Call the LLM with the complete prompt and stream the response
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      stream: true,
      messages: finalMessages,
    })

    const stream = OpenAIStream(response)
    return new StreamingTextResponse(stream)
  } catch (error) {
    console.error('[MARZ API Error]:', error)
    return new Response(
      `Failed to process request: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    )
  }
}
