import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { BarChart, CheckCircle, Clock, XCircle } from 'lucide-react'

export default async function AdminReturnAnalyticsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  })

  if (user?.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch analytics data
  const totalRequests = await prisma.order.count({
    where: { returnStatus: { not: null } },
  })
  const pendingRequests = await prisma.order.count({
    where: { returnStatus: 'requested' },
  })
  const approvedRequests = await prisma.order.count({
    where: { returnStatus: 'approved' },
  })
  const rejectedRequests = await prisma.order.count({
    where: { returnStatus: 'rejected' },
  })

  const mostReturnedProducts = await prisma.orderItem.groupBy({
    by: ['name'],
    _count: {
      name: true,
    },
    where: {
      order: {
        returnStatus: { not: null },
      },
    },
    orderBy: {
      _count: {
        name: 'desc',
      },
    },
    take: 5,
  })

  const stats = [
    { name: 'Total Requests', value: totalRequests, icon: BarChart },
    { name: 'Pending', value: pendingRequests, icon: Clock },
    { name: 'Approved', value: approvedRequests, icon: CheckCircle },
    { name: 'Rejected', value: rejectedRequests, icon: XCircle },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Admin - Return Analytics</h1>
        <p className="mt-2 text-lg text-zinc-400">An overview of customer return requests.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {stats.map((stat) => (
          <div key={stat.name} className="overflow-hidden rounded-lg bg-zinc-900 border border-zinc-800 px-4 py-5 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 text-zinc-400" aria-hidden="true" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dt className="truncate text-sm font-medium text-zinc-400">{stat.name}</dt>
                <dd className="text-3xl font-semibold tracking-tight text-white">{stat.value}</dd>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Most Returned Products */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Most Returned Products</h2>
        {mostReturnedProducts.length === 0 ? (
          <div className="text-center py-10 rounded-lg border-2 border-dashed border-zinc-800">
            <p className="text-zinc-400">No products have been returned yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-700">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-6">Product Name</th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-white">Number of Returns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-zinc-900">
                {mostReturnedProducts.map((product) => (
                  <tr key={product.name}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-6">{product.name}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-zinc-300">{product._count.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}