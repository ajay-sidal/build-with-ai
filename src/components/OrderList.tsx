'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { Package, Receipt, Calendar, Hash, RefreshCw, ArrowUpDown, Truck, Filter, Search, Download, XCircle, User, Undo2 } from 'lucide-react'
import { useCart } from '@/components/providers/CartProvider'
import { allProducts } from '@/lib/openprovider-products'
import { Select } from './ui/select'
import { Input } from './ui/input'
import { Button } from './ui/button'

const ORDERS_PER_PAGE = 5;

export default function OrderList({ initialOrders, totalOrders, isAdmin = false }: { initialOrders: any[], totalOrders: number, isAdmin?: boolean }) {
  const { addToCart } = useCart()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [orders, setOrders] = useState(initialOrders)
  const [isCancelling, setIsCancelling] = useState<string | null>(null)
  const [isRequestingReturn, setIsRequestingReturn] = useState<string | null>(null)

  const page = Number(searchParams.get('page')) || 1
  const sortBy = searchParams.get('sortBy') || 'newest'
  const [startDate, setStartDate] = useState(searchParams.get('startDate') || '')
  const [endDate, setEndDate] = useState(searchParams.get('endDate') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')


  useEffect(() => {
    setOrders(initialOrders)
  }, [initialOrders])

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSortBy = e.target.value
    const params = new URLSearchParams(searchParams.toString())
    params.set('sortBy', newSortBy)
    params.set('page', '1') // Reset to first page on sort change
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleFilter = () => {
    const params = new URLSearchParams(searchParams.toString())
    if (startDate) {
      params.set('startDate', startDate)
    } else {
      params.delete('startDate')
    }
    if (endDate) {
      params.set('endDate', endDate)
    } else {
      params.delete('endDate')
    }
    if (searchQuery) {
      params.set('q', searchQuery)
    } else {
      params.delete('q')
    }
    params.set('page', '1') // Reset to first page on filter change
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm('Are you sure you want to cancel this order? This will issue a full refund and cannot be undone.')) {
      return
    }
    setIsCancelling(orderId)
    try {
      const response = await fetch('/api/orders/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to cancel order.')
      }
      router.refresh() // Refresh the page to show the updated order status
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An unknown error occurred.')
    } finally {
      setIsCancelling(null)
    }
  }

  const handleRequestReturn = async (orderId: string) => {
    const reason = window.prompt('Please provide a reason for your return request:');
    if (reason === null) { // User clicked cancel
        return;
    }
    if (!reason.trim()) {
        alert('A reason is required to request a return.');
        return;
    }

    setIsRequestingReturn(orderId);
    try {
        const response = await fetch('/api/orders/return', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId, reason }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to request return.');
        }
        router.refresh(); // Refresh the page to show the updated order status
    } catch (error) {
        alert(error instanceof Error ? error.message : 'An unknown error occurred.');
    } finally {
        setIsRequestingReturn(null);
    }
  };

  const handleReorder = (orderItems: any[]) => {
    orderItems.forEach(item => {
      const productToAdd = allProducts.find(p => p.name === item.name)
      if (productToAdd) {
        addToCart(productToAdd)
      }
    })
    // Optionally, redirect to cart
    router.push('/cart');
  }

  const getTrackingUrl = (provider: string, trackingNumber: string) => {
    // This can be expanded with more providers
    if (provider?.toLowerCase() === 'ups') {
      return `https://www.ups.com/track?loc=en_US&tracknum=${trackingNumber}`
    }
    if (provider?.toLowerCase() === 'fedex') {
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingNumber}`
    }
    // Generic fallback
    return `https://www.google.com/search?q=${provider}+tracking+${trackingNumber}`
  }

  return (
    <>
      <div className="mb-8 p-4 rounded-lg border border-zinc-800 bg-zinc-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
          <div className="lg:col-span-4">
            <label htmlFor="search" className="block text-xs font-medium text-zinc-400 mb-1">Search Orders</label>
            <Input id="search" type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Product name or Order ID..." />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="startDate" className="block text-xs font-medium text-zinc-400 mb-1">Start Date</label>
            <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="lg:col-span-2">
            <label htmlFor="endDate" className="block text-xs font-medium text-zinc-400 mb-1">End Date</label>
            <Input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Select id="sortBy" onChange={handleSortChange} value={sortBy}>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="total-desc">Total (High to Low)</option>
              <option value="total-asc">Total (Low to High)</option>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button onClick={handleFilter} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-500">
              <Filter size={16} />
              Apply Filters
            </Button>
          </div>
            {totalOrders > 0 && (
              <Button onClick={() => { window.location.href = '/api/orders/export' }} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-700">
                <Download size={16} />
                Export as CSV
              </Button>
            )}
        </div>
      </div>

      <div className="space-y-8">
        {orders.map((order: any) => (
          <div key={order.id} className="rounded-lg border border-zinc-800 bg-zinc-900">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-700 bg-zinc-800/50 p-4">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-zinc-400">
                <div className="flex items-center gap-2"><Calendar size={16} /><span>{new Date(order.createdAt).toLocaleDateString()}</span></div>
                {isAdmin && order.user && (
                  <div className="flex items-center gap-2" title={order.user.email}>
                    <User size={16} /><span>{order.user.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-2"><Hash size={16} /><span className="truncate">#{order.stripeId.substring(0, 12)}...</span></div>
              </div>
              <div className="text-base font-bold text-white">${(order.amountTotal / 100).toFixed(2)}</div>
            </div>
            <div className="p-6">
              <ul className="space-y-3">
                {order.items.map((item: any) => (
                  <li key={item.id} className="flex items-center gap-3 text-sm"><Package size={16} className="text-zinc-500" /><span className="text-zinc-300">{item.name} (x{item.quantity})</span></li>
                ))}
              </ul>
              <div className="mt-6 flex flex-wrap justify-end items-center gap-4">
                {order.shippingStatus === 'shipped' && order.trackingNumber && order.trackingProvider && (
                  <Button onClick={() => window.open(getTrackingUrl(order.trackingProvider, order.trackingNumber), '_blank', 'noopener,noreferrer')} className="inline-flex items-center gap-2 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                    <Truck size={16} /> Track Shipment
                  </Button>
                )}
                {order.shippingStatus === 'delivered' && !order.returnStatus && (
                  <Button onClick={() => handleRequestReturn(order.id)} disabled={isRequestingReturn === order.id} className="inline-flex items-center gap-2 text-sm font-medium text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50">
                    {isRequestingReturn === order.id ? <><RefreshCw size={16} className="animate-spin" /> Requesting...</> : <><Undo2 size={16} /> Request Return</>}
                  </Button>
                )}
                {order.returnStatus && (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400" title={`Reason: ${order.returnReason}`}>
                    Return {order.returnStatus}
                  </span>
                )}
                {order.shippingStatus === 'cancelled' && (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-red-400">
                    <XCircle size={16} /> Order Cancelled
                  </span>
                )}
                {order.shippingStatus === 'processing' && (
                  <>
                    <span className="inline-flex items-center gap-2 text-sm font-medium text-amber-400"><RefreshCw size={16} className="animate-spin" /> Processing Shipment</span>
                    <Button onClick={() => handleCancelOrder(order.id)} disabled={isCancelling === order.id} className="inline-flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors disabled:opacity-50">
                      {isCancelling === order.id ? <><RefreshCw size={16} className="animate-spin" /> Cancelling...</> : <><XCircle size={16} /> Cancel Order</>}
                    </Button>
                  </>
                )}
                <Button onClick={() => handleReorder(order.items)} className="inline-flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"><RefreshCw size={16} /> Re-order</Button>
                <Link href={`/dashboard/orders/${order.stripeId}`} className="inline-flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300">View Details <Receipt size={16} /></Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {totalOrders > ORDERS_PER_PAGE && (
        <div className="mt-8 flex items-center justify-between text-sm">
          <Link href={`/dashboard/orders?page=${page - 1}&sortBy=${sortBy}`} className={`rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 ${page <= 1 ? 'pointer-events-none opacity-50' : ''}`}>&larr; Previous</Link>
          <span className="text-zinc-400">Page {page} of {Math.ceil(totalOrders / ORDERS_PER_PAGE)}</span>
          <Link href={`/dashboard/orders?page=${page + 1}&sortBy=${sortBy}`} className={`rounded-md border border-zinc-700 bg-zinc-800 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 ${page * ORDERS_PER_PAGE >= totalOrders ? 'pointer-events-none opacity-50' : ''}`}>Next &rarr;</Link>
        </div>
      )}
    </>
  )
}