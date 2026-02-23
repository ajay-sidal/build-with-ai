import { NextResponse } from 'next/server'
import Groq from 'groq-sdk'

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 second timeout

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
          response: "I apologize, but MARZ is not fully configured yet. The GROQ_API_KEY environment variable is missing. Please contact the administrator.",
          suggestions: ['What products do you offer?', 'Tell me about domains', 'What is SSL?'],
        },
        { status: 503 }
      )
    }

    const groq = new Groq({ 
      apiKey: groqApiKey,
      timeout: 50000, // 50 second timeout for API calls
    })

    // Parse request body
    const { messages } = await req.json()
    const userQuery = messages?.[messages.length - 1]?.content

    if (!userQuery) {
      console.error('[MARZ] Missing user query in request')
      return new Response('Missing user query', { status: 400 })
    }

    console.log('[MARZ] Processing query:', userQuery)

    // COMPACT system prompt - NO massive product catalog (RAG would be better but requires Vector DB setup)
    const systemPrompt = `You are MARZ, a friendly AI assistant for BUILD WITH AI.

**Quick Reference:**
- **Domains**: 1,500+ TLDs (.com, .ai, .io, etc.) - Registration, Transfer, Renewal
- **SSL**: Domain Validation, Organization Validation, Extended Validation, Wildcard, Multi-Domain, Code Signing
- **DNS**: Free DNS Hosting, Premium DNS, DNS Templates, Nameserver Groups
- **Email**: Email Verification, Email Templates, Spam Experts, EasyDMARC
- **Hosting**: Plesk Licenses, Virtuozzo Licenses, Templates Storefront
- **Services**: Customer Management, Domain Management, SSL Management, AI Web Design

Be conversational and helpful. Use markdown formatting. Keep responses concise. If asked about specific pricing or details you don't have, offer to help them find more information.`

    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    // Call the LLM with timeout handling
    console.log('[MARZ] Calling Groq API...')
    
    let completion: any
    try {
      completion = await Promise.race([
        groq.chat.completions.create({
          model: 'llama3-8b-8192',
          messages: finalMessages,
          max_tokens: 1024,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('API_TIMEOUT')), 55000)
        ),
      ])
    } catch (apiError: any) {
      if (apiError.message === 'API_TIMEOUT') {
        console.error('[MARZ] Groq API timeout')
        return NextResponse.json(
          {
            error: 'API_TIMEOUT',
            response: "I apologize, but the request is taking longer than expected. Please try again.",
            suggestions: ['Try asking a simpler question', 'Check your internet connection', 'Contact support if this persists'],
          },
          { status: 504 }
        )
      }
      throw apiError
    }

    const aiResponse = completion.choices[0]?.message?.content || 'I apologize, but I could not generate a response.'
    console.log('[MARZ] Got response from Groq')

    // Generate simple suggestions
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
    
    // Log to admin dashboard
    try {
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/logs/client-error`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: 'MARZ API request failed',
          details: {
            error: errorMessage,
            stack: error instanceof Error ? error.stack : undefined,
          },
          timestamp: new Date().toISOString(),
        }),
      }).catch(() => {}) // Ignore logging errors
    } catch {}
    
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
