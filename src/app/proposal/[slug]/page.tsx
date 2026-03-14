import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { getDataDir } from '../../../lib/dataDir'
import ProposalClient from './ProposalClient'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

type ProposalScope = {
  aiDesign?: boolean
  domain?: { fqdn: string; resellerPrice: number }
  ssl?: { resellerPrice: number }
}

type ProposalRecord = {
  clientName: string
  email?: string
  scope: ProposalScope
  depositAmount?: number
  totalPrice?: number
  currency?: string
}

type ProposalsFile = Record<string, ProposalRecord>

async function loadProposal(slug: string): Promise<ProposalRecord | null> {
  const dataDir = getDataDir()
  const paths = [join(dataDir, 'proposals.json'), join(dataDir, 'proposals.sample.json')]

  for (const p of paths) {
    const text = await readFile(p, { encoding: 'utf8' }).catch((err: any) => {
      if (err?.code === 'ENOENT') return null
      throw err
    })
    if (!text) continue
    try {
      const json = JSON.parse(text) as ProposalsFile
      if (json && json[slug]) return json[slug]!
    } catch {
      // ignore
    }
  }

  return null
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const proposal = await loadProposal(params.slug)
  const clientName = proposal?.clientName || params.slug

  return {
    title: `Proposal — ${clientName}`,
    description: `Bespoke digital strategy and AI-native build plan for ${clientName}.`,
    robots: { index: false, follow: false },
    openGraph: {
      title: `Proposal — ${clientName}`,
      description: `Bespoke digital strategy and AI-native build plan for ${clientName}.`,
      url: `/proposal/${params.slug}`,
    },
  }
}

export default async function ProposalPage({ params }: { params: { slug: string } }) {
  const data = await loadProposal(params.slug)

  if (!data) {
    notFound()
  }

  const clientName = data.clientName
  const scope = data.scope || { aiDesign: true }

  return (
    <ProposalClient
      data={{
        slug: params.slug,
        clientName,
        scope,
        depositAmount: data.depositAmount ?? 999,
        currency: data.currency ?? 'USD',
      }}
    />
  )
}
