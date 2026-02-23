// Serverless function for heavy computational tasks
// Optimized for Vercel Serverless with proper timeout handling
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { captureException } from '@/lib/sentry'
import { logger } from '@/lib/logger'
import { startSpan } from '@/lib/tracing'

// Configure for serverless execution
export const runtime = 'nodejs' // or 'edge' for edge functions
export const maxDuration = 60 // seconds (adjust based on Vercel plan)

// Request validation schema
const HeavyTaskSchema = z.object({
  taskType: z.enum(['vector-embedding', 'image-processing', 'data-transformation', 'bulk-operation']),
  payload: z.record(z.unknown()),
  priority: z.enum(['low', 'normal', 'high']).optional().default('normal'),
})

export async function POST(request: NextRequest) {
  const span = startSpan('heavy-task')
  const requestId = crypto.randomUUID()

  try {
    // Parse and validate request
    const json = await request.json()
    const validated = HeavyTaskSchema.parse(json)

    logger.info('Heavy task received', {
      requestId,
      taskType: validated.taskType,
      priority: validated.priority,
    })

    // Process based on task type
    let result: unknown
    switch (validated.taskType) {
      case 'vector-embedding':
        result = await processVectorEmbedding(validated.payload)
        break
      case 'image-processing':
        result = await processImage(validated.payload)
        break
      case 'data-transformation':
        result = await processDataTransformation(validated.payload)
        break
      case 'bulk-operation':
        result = await processBulkOperation(validated.payload, validated.priority)
        break
      default:
        throw new Error(`Unknown task type: ${validated.taskType}`)
    }

    span.end({ requestId, status: 'success' })

    return NextResponse.json(
      {
        success: true,
        requestId,
        taskType: validated.taskType,
        result,
      },
      {
        headers: {
          'X-Request-ID': requestId,
          'X-Task-Type': validated.taskType,
        },
      }
    )
  } catch (error) {
    span.end({ requestId, status: 'error' })

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          requestId,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400, headers: { 'X-Request-ID': requestId } }
      )
    }

    // Log and capture error
    logger.error('Heavy task failed', { requestId, error })
    captureException(error, { requestId, context: 'heavy-task' })

    return NextResponse.json(
      {
        success: false,
        requestId,
        error: error instanceof Error ? error.message : 'Task failed',
      },
      { status: 500, headers: { 'X-Request-ID': requestId } }
    )
  }
}

async function processVectorEmbedding(payload: Record<string, unknown>): Promise<unknown> {
  // Simulate vector embedding computation
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { embeddings: 128, dimensions: 768 }
}

async function processImage(payload: Record<string, unknown>): Promise<unknown> {
  // Simulate image processing
  await new Promise((resolve) => setTimeout(resolve, 2000))
  return { processed: true, format: 'webp' }
}

async function processDataTransformation(payload: Record<string, unknown>): Promise<unknown> {
  // Simulate data transformation
  await new Promise((resolve) => setTimeout(resolve, 500))
  return { transformed: true, records: 100 }
}

async function processBulkOperation(
  payload: Record<string, unknown>,
  priority: 'low' | 'normal' | 'high'
): Promise<unknown> {
  // Simulate bulk operation with priority-based processing
  const delay = priority === 'high' ? 500 : priority === 'normal' ? 1000 : 2000
  await new Promise((resolve) => setTimeout(resolve, delay))
  return { completed: true, priority }
}
