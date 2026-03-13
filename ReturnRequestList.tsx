'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Check, X, RefreshCw, Printer } from 'lucide-react'

export default function ReturnRequestList({ initialReturnRequests }: { initialReturnRequests: any[] }) {
  const router = useRouter()
  const [requests, setRequests] = useState(initialReturnRequests)
  const [isUpdating, setIsUpdating] = useState<string | null>(null)
  const [isPrinting, setIsPrinting] = useState<string | null>(null)

  const handleUpdateStatus = async (orderId: string, status: 'approved' | 'rejected') => {
    setIsUpdating(orderId)
    try {
      const response = await fetch('/api/admin/returns/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update status.')
      }
      
      // Refresh server-side props to get the latest list
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unknown error occurred.')
    } finally {
      setIsUpdating(null)
    }
  }

  const handlePrintLabel = async (orderId: string) => {
    setIsPrinting(orderId)
    try {
      const response = await fetch('/api/admin/returns/generate-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate label.')
      }

      const { labelUrl } = await response.json()
      window.open(labelUrl, '_blank')
      // Refresh the page to update the button state to "View Label"
      router.refresh()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unknown error occurred.')
    } finally {
      setIsPrinting(null)
    }
  }

  const getStatusChip = (status: string) => {
    switch (status) {
      case 'requested':
        return <span className="inline-flex items-center rounded-full bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400">Requested</span>
      case 'approved':
        return <span className="inline-flex items-center rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400">Approved</span>
      case 'rejected':
        return <span className="inline-flex items-center rounded-full bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400">Rejected</span>
      case 'completed':
        return <span className="inline-flex items-center rounded-full bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400">Completed</span>
      default:
        return <span className="inline-flex items-center rounded-full bg-zinc-500/10 px-2 py-1 text-xs font-medium text-zinc-400">{status}</span>
    }
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="min-w-full divide-y divide-zinc-700">
        <thead className="bg-zinc-800/50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Order ID</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Customer</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Reason</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Date Requested</th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800 bg-zinc-900">
          {requests.map((req) => (
            <tr key={req.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{req.stripeId.substring(0, 15)}...</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">{req.user.email}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300 max-w-xs truncate" title={req.returnReason}>{req.returnReason}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">{new Date(req.returnRequestedAt).toLocaleString()}</td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">{getStatusChip(req.returnStatus)}</td>
              <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                {req.returnStatus === 'requested' && (
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'approved')}
                      disabled={isUpdating === req.id}
                      className="inline-flex items-center gap-1 rounded-md bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/20 disabled:opacity-50"
                    >
                      {isUpdating === req.id ? <RefreshCw size={12} className="animate-spin" /> : <Check size={12} />} Approve
                    </button>
                    <button 
                      onClick={() => handleUpdateStatus(req.id, 'rejected')}
                      disabled={isUpdating === req.id}
                      className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                    >
                      {isUpdating === req.id ? <RefreshCw size={12} className="animate-spin" /> : <X size={12} />} Reject
                    </button>
                  </div>
                )}
                {req.returnStatus === 'approved' && (
                  req.returnLabelUrl ? (
                    <a
                      href={req.returnLabelUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20"
                    >
                      <Printer size={12} /> View Label
                    </a>
                  ) : (
                    <button
                      onClick={() => handlePrintLabel(req.id)}
                      disabled={isPrinting === req.id}
                      className="inline-flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-1 text-xs font-medium text-blue-400 hover:bg-blue-500/20 disabled:opacity-50"
                    >
                      {isPrinting === req.id ? <RefreshCw size={12} className="animate-spin" /> : <Printer size={12} />}
                      Generate Label
                    </button>
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}