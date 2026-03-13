/**
 * AI Content Generator Component
 * Uses streaming API for real-time content generation
 */

'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check, Loader2, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

type ContentType = 'product-description' | 'blog-post' | 'email' | 'social-media' | 'landing-page'
type ToneType = 'professional' | 'casual' | 'exciting' | 'friendly' | 'technical'

export default function AIContentGenerator() {
  const [topic, setTopic] = React.useState('')
  const [contentType, setContentType] = React.useState<ContentType>('product-description')
  const [tone, setTone] = React.useState<ToneType>('professional')
  const [generatedContent, setGeneratedContent] = React.useState('')
  const [isGenerating, setIsGenerating] = React.useState(false)
  const [copied, setCopied] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleGenerate = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)
    setError(null)
    setGeneratedContent('')

    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          contentType,
          tone,
          maxLength: 300,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Generation failed')
      }

      // Read streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader!.read()
        if (done) break

        const text = decoder.decode(value)
        setGeneratedContent((prev) => prev + text)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-blue-600/10">
          <Sparkles className="h-6 w-6 text-blue-500" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-zinc-100">AI Content Generator</h2>
          <p className="text-sm text-zinc-400">Generate professional content powered by Groq AI</p>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid gap-4 p-6 rounded-xl border border-zinc-800 bg-zinc-950/50">
        <div className="grid gap-2">
          <label className="text-sm font-medium text-zinc-300">
            Topic or Subject *
          </label>
          <Textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g., Premium domain name: AIStartupHub.com for tech startups"
            className="min-h-[100px] resize-none"
            disabled={isGenerating}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">
              Content Type
            </label>
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as ContentType)}
              className="flex h-12 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200/20"
              disabled={isGenerating}
            >
              <option value="product-description">Product Description</option>
              <option value="blog-post">Blog Post</option>
              <option value="email">Email</option>
              <option value="social-media">Social Media</option>
              <option value="landing-page">Landing Page</option>
            </select>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium text-zinc-300">
              Tone
            </label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as ToneType)}
              className="flex h-12 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-200/20"
              disabled={isGenerating}
            >
              <option value="professional">Professional</option>
              <option value="casual">Casual</option>
              <option value="exciting">Exciting</option>
              <option value="friendly">Friendly</option>
              <option value="technical">Technical</option>
            </select>
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!topic.trim() || isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate Content
            </>
          )}
        </Button>
      </div>

      {/* Output Section */}
      <AnimatePresence>
        {(generatedContent || error) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-zinc-300">
                {error ? 'Error' : 'Generated Content'}
              </h3>
              <div className="flex gap-2">
                {generatedContent && (
                  <>
                    <Button
                      variant="secondary"
                      onClick={handleGenerate}
                      disabled={isGenerating}
                      className="h-9 px-3"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCopy}
                      className="h-9 px-3"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </>
                )}
              </div>
            </div>

            {error ? (
              <p className="text-red-400 text-sm">{error}</p>
            ) : (
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 whitespace-pre-wrap">{generatedContent}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <div className="text-center text-xs text-zinc-500">
        Powered by Groq AI • Free tier: 30 requests/minute • Llama 3.3 70B model
      </div>
    </div>
  )
}
"// TypeScript cache refresh"  
