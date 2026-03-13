import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import OrderList from '@/components/OrderList'

const ORDERS_PER_PAGE = 10;

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: { page?: string; sortBy?: string; startDate?: string; endDate?: string; q?: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Fetch user from DB to verify role
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== 'admin') {
    redirect('/dashboard') // Or a dedicated 'unauthorized' page
  }

  const page = Number(searchParams?.page) || 1
  const sortBy = searchParams?.sortBy || 'newest'
  const { startDate, endDate, q: searchQuery } = searchParams

  const orderBy = () => {
    switch (sortBy) {
      case 'oldest':
        return { createdAt: 'asc' }
      case 'total-desc':
        return { amountTotal: 'desc' }
      case 'total-asc':
        return { amountTotal: 'asc' }
      default:
        return { createdAt: 'desc' }
    }
  }

  const whereClause: any = {} // No user filter for admin
  if (startDate || endDate) {
    whereClause.createdAt = {}
    if (startDate) {
      whereClause.createdAt.gte = new Date(startDate)
    }
    if (endDate) {
      const endOfDay = new Date(endDate)
      endOfDay.setDate(endOfDay.getDate() + 1)
      whereClause.createdAt.lt = endOfDay
    }
  }
  if (searchQuery) {
    whereClause.OR = [
      { stripeId: { contains: searchQuery, mode: 'insensitive' } },
      { items: { some: { name: { contains: searchQuery, mode: 'insensitive' } } } },
      { user: { email: { contains: searchQuery, mode: 'insensitive' } } }, // Search by user email
    ]
  }

  const totalOrders = await prisma.order.count({
    where: whereClause,
  })

  const orders = await prisma.order.findMany({
    where: whereClause,
    orderBy: orderBy(),
    include: {
      items: true,
      user: { select: { email: true, name: true } }, // Include user email and name
    },
    take: ORDERS_PER_PAGE,
    skip: (page - 1) * ORDERS_PER_PAGE,
  })

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Admin - All Orders</h1>
        <p className="mt-2 text-lg text-zinc-400">View and manage all customer orders.</p>
      </div>

      {totalOrders === 0 && !searchQuery && !startDate && !endDate ? (
        <div className="text-center py-16 rounded-lg border-2 border-dashed border-zinc-800">
          <p className="text-zinc-400">No orders have been placed yet.</p>
        </div>
      ) : (
        <OrderList initialOrders={orders} totalOrders={totalOrders} isAdmin={true} />
      )}
    </div>
  )
}