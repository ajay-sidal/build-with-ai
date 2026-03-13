/**
 * AI Content Generator API
 * Uses Groq FREE tier for fast LLM inference
 * 
 * Usage: POST /api/ai/generate
 * Body: { topic: string, tone?: string, maxLength?: number }
 */

import { NextRequest, NextResponse } from 'next/server'
import { streamText } from 'ai'
import { groq } from '@ai-sdk/groq'
import { z } from 'zod'
import { logger } from '@/lib/logger'
import { captureException } from '@/lib/sentry'

// Request validation schema
const GenerateRequestSchema = z.object({
  topic: z.string().min(10).max(500),
  tone: z.enum(['professional', 'casual', 'exciting', 'friendly', 'technical']).optional().default('professional'),
  maxLength: z.number().min(50).max(2000).optional().default(300),
  contentType: z.enum(['product-description', 'blog-post', 'email', 'social-media', 'landing-page']).optional().default('product-description'),
})

export async function POST(request: NextRequest) {
  const requestId = crypto.randomUUID()
  
  try {
    // Validate request
    const json = await request.json()
    const validated = GenerateRequestSchema.parse(json)

    logger.info('AI content generation requested', {
      requestId,
      topic: validated.topic.substring(0, 50),
      contentType: validated.contentType,
    })

    // Build prompt based on content type
    const prompt = buildPrompt(validated)

    // Stream the response
    const result = streamText({
      model: groq('llama-3.3-70b-versatile'),
      prompt,
      temperature: 0.7,
    })

    // Return as text stream
    return result.toTextStreamResponse({
      headers: {
        'X-Request-ID': requestId,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    })
  } catch (error) {
    logger.error('AI content generation failed', { requestId, error })
    captureException(error, { requestId, context: 'ai-generate' })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      )
    }

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Generation failed',
      },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    )
  }
}

function buildPrompt(validated: z.infer<typeof GenerateRequestSchema>): string {
  const { topic, tone, maxLength, contentType } = validated

  const prompts = {
    'product-description': `Write a compelling product description for: "${topic}"
Include:
- Catchy headline
- 3 key benefits
- Pricing suggestion (if applicable)
- Call-to-action

Tone: ${tone}
Length: Under ${maxLength} words`,

    'blog-post': `Write an engaging blog post introduction about: "${topic}"
Include:
- Attention-grabbing opening
- Brief overview of what will be covered
- Why readers should care

Tone: ${tone}
Length: Under ${maxLength} words`,

    'email': `Write a professional email about: "${topic}"
Include:
- Clear subject line
- Professional greeting
- Main message
- Call-to-action
- Professional sign-off

Tone: ${tone}
Length: Under ${maxLength} words`,

    'social-media': `Write engaging social media content about: "${topic}"
Include:
- Hook in first line
- Main message
- Relevant hashtags (3-5)

Tone: ${tone}
Platform: LinkedIn/Twitter
Length: Under ${maxLength} characters`,

    'landing-page': `Write persuasive landing page copy for: "${topic}"
Include:
- Compelling headline
- Subheadline with value proposition
- 3-4 key features/benefits
- Social proof placeholder
- Strong call-to-action

Tone: ${tone}
Length: Under ${maxLength} words`,
  }

  return prompts[contentType]
}

// GET endpoint for health check
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    provider: 'groq',
    model: 'llama-3.3-70b-versatile',
    free_tier: {
      requests_per_minute: 30,
      requests_per_day: 14400,
    },
  })
}
