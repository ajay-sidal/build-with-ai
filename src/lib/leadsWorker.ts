// Leads worker: enrich a lead by domain/company and persist to Prisma
import { prisma } from './prisma'
import { enrichWithClearbit } from './enrichments/clearbit'
import { findContactsWithHunter } from './enrichments/hunter'

export async function processLeadsJob(job: any) {
  console.log('[LEADS WORKER] processing job', job)
  const { domain, company, userId } = job || {}

  if (!domain && !company) {
    return { success: false, error: 'missing domain or company' }
  }

  // Upsert lead by domain or company
  const where = domain ? { domain } : { company }
  const data: any = {
    company: company || domain || 'unknown',
    domain: domain || null,
  }

  let lead: any
  if (domain) {
    // domain is expected to be unique
    lead = await prisma.lead.upsert({
      where: { domain },
      update: { updatedAt: new Date() },
      create: { ...data },
    })
  } else {
    // company may not be unique; try to find an existing lead then update or create
    const existing = await prisma.lead.findFirst({ where: { company: data.company } })
    if (existing) {
      lead = await prisma.lead.update({ where: { id: existing.id }, data: { updatedAt: new Date() } })
    } else {
      lead = await prisma.lead.create({ data: { ...data } })
    }
  }

  const enrichments: any[] = []

  // Call Clearbit (company enrichment)
  if (domain) {
    const cb = await enrichWithClearbit(domain)
    if (cb) {
      const rec = await prisma.leadEnrichment.create({
        data: {
          leadId: lead.id,
          provider: 'clearbit',
          data: cb,
          verified: true,
        },
      })
      enrichments.push(rec)
    }
  }

  // Call Hunter (contact discovery)
  if (domain) {
    const h = await findContactsWithHunter(domain)
    if (h) {
      const rec = await prisma.leadEnrichment.create({
        data: {
          leadId: lead.id,
          provider: 'hunter',
          data: h,
          verified: false,
        },
      })
      enrichments.push(rec)
    }
  }

  // Optionally link job record
  try {
    const jobRec = await prisma.leadJob.create({
      data: {
        userId: userId || null,
        status: 'completed',
        params: job,
        result: { leadId: lead.id, enrichments: enrichments.map(e => e.id) },
        completedAt: new Date(),
      },
    })
    return { success: true, leadId: lead.id, jobId: jobRec.id }
  } catch (e) {
    console.error('Failed to create job record', e)
    return { success: true, leadId: lead.id }
  }
}
