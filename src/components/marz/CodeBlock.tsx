'use client'

import * as React from 'react'
import { Copy, Check } from 'lucide-react'
import { Button } from '../ui/button'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'

interface CodeBlockProps {
  language: string
  code: string
}

export default function CodeBlock({ language, code }: CodeBlockProps) {
  const [isCopied, setIsCopied] = React.useState(false)

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(code)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }, [code])

  return (
    <div className="my-3 overflow-hidden rounded-lg border border-zinc-700 bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800/50 px-3 py-2">
        <span className="text-xs font-medium text-zinc-400">
          {language || 'code'}
        </span>
        <Button
          onClick={handleCopy}
          className="inline-flex items-center gap-1.5 rounded-md border border-zinc-600 bg-zinc-700 px-2 py-1 text-xs text-zinc-300 transition-colors hover:bg-zinc-600 hover:text-zinc-100"
          title={isCopied ? 'Copied!' : 'Copy code'}
          variant="secondary"
        >
          {isCopied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span>Copy</span>
            </>
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        customStyle={{
          margin: 0,
          padding: '0.75rem',
          backgroundColor: 'transparent',
          fontSize: '0.75rem',
        }}
        codeTagProps={{
          style: { fontFamily: 'inherit' },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  )
}
