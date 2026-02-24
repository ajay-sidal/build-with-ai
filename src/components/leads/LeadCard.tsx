import React from 'react'

export default function LeadCard({name}:{name?:string}){
  return (
    <div className="lead-card p-3 border rounded">
      <div className="font-semibold">{name || 'Company Name'}</div>
      <div className="text-sm text-muted">Lead preview & enrichment</div>
    </div>
  )
}
