import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs'
export const maxDuration = 30 // 30 second timeout

export async function POST(req: Request) {
  try {
    console.log('[MARZ] Received chat request')

    // Check for GROQ API key
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey || groqApiKey.trim() === '') {
      console.error('[MARZ] GROQ_API_KEY is not configured')
      return NextResponse.json(
        {
          error: 'GROQ_API_KEY not configured',
          response: "I apologize, but MARZ is not fully configured yet. The GROQ_API_KEY environment variable is missing.",
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
      console.error('[MARZ] Missing user query in request')
      return new Response('Missing user query', { status: 400 })
    }

    console.log('[MARZ] Processing query:', userQuery)

    // System prompt with product knowledge
    const systemPrompt = `You are MARZ, a friendly and expert AI assistant for BUILD WITH AI.

**BUILD WITH AI Products & Services:**

1. **Domain Registration** - Search and register domains with 1,500+ TLDs (.com, .ai, .io, etc.)
2. **SSL Certificates** - Zero-knowledge SSL certificates (Domain Validation, Organization Validation, Extended Validation, Wildcard, Multi-Domain)
3. **DNS Hosting** - Fast, reliable DNS with instant propagation
4. **Premium DNS** - Enhanced DNS with advanced features
5. **Email Verification** - Verify email addresses for deliverability
6. **Email Templates** - Professional email templates
7. **Spam Experts** - Email spam filtering and archiving
8. **EasyDMARC** - DMARC, SPF, DKIM email authentication
9. **Templates Storefront** - Website templates
10. **Plesk Licenses** - Plesk hosting control panel licenses
11. **Virtuozzo Licenses** - Virtuozzo virtualization licenses

**Services:**
- Customer Management
- Domain Management
- SSL Management
- AI Web Design

Be conversational, helpful, and use markdown formatting. Keep responses concise but informative.`

    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    // Call the LLM
    console.log('[MARZ] Calling Groq API...')
    const completion = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: finalMessages,
      max_tokens: 1024,
    })

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
    console.log('[MARZ] Got response from Groq')

    // Generate simple suggestions based on common queries
    const suggestions = [
      'Tell me about domain pricing',
      'What SSL options are available?',
      'How does DNS hosting work?',
    ]

    console.log('[MARZ] Sending response back to client')
    return NextResponse.json({
      response: aiResponse,
      suggestions,
      matches: [],
    })
  } catch (error) {
    console.error('[MARZ API Error]:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: 'Failed to process request',
        response: `I apologize, but I'm experiencing technical difficulties. (Error: ${errorMessage})`,
        suggestions: ['Tell me about domains', 'What SSL options are available?', 'Help me choose a product'],
      },
      { status: 500 }
    )
  }
}
