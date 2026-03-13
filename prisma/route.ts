import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  // Verify user is an admin
  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (user?.role !== 'admin') {
    return new NextResponse(JSON.stringify({ error: 'Forbidden' }), { status: 403 })
  }

  try {
    const { orderId } = await req.json()

    if (!orderId) {
      return new NextResponse(JSON.stringify({ error: 'Order ID is required' }), { status: 400 })
    }

    // Find the order to ensure it's approved for return
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        returnStatus: 'approved',
      },
    })

    if (!order) {
      return new NextResponse(JSON.stringify({ error: 'Order not found or not approved for return' }), { status: 404 })
    }

    // If a label already exists, return it to prevent re-generation
    if (order.returnLabelUrl) {
      return NextResponse.json({ labelUrl: order.returnLabelUrl })
    }

    // --- Simulate Label Generation ---
    // In a real application, you would integrate with a shipping API (e.g., EasyPost) here.
    const dummyLabelUrl = `https://example.com/labels/return-${order.id}.pdf`

    // Update the order with the generated label URL
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { returnLabelUrl: dummyLabelUrl },
    })

    return NextResponse.json({ labelUrl: updatedOrder.returnLabelUrl })
  } catch (error) {
    console.error('Failed to generate return label:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 })
  }
}