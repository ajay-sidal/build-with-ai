import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'
import { ReturnStatusUpdateEmail } from '@/components/emails/ReturnStatusUpdateEmail'

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
    const { orderId, status } = await req.json()

    if (!orderId || !status || !['approved', 'rejected'].includes(status)) {
      return new NextResponse(JSON.stringify({ error: 'Order ID and a valid status (approved/rejected) are required' }), { status: 400 })
    }

    // Find the order to ensure it exists and has a pending return request
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        returnStatus: 'requested',
      },
      include: {
        user: { select: { email: true } }, // Include user email for notification
      },
    })

    if (!order) {
      return new NextResponse(JSON.stringify({ error: 'Order not found or return request not pending' }), { status: 404 })
    }

    // Update the order status in our database
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: {
        returnStatus: status,
      },
    })

    // Send email notification to the customer
    const customerEmail = order.user.email
    if (customerEmail) {
      if (!process.env.RESEND_API_KEY) {
        console.error('Email sending failed: RESEND_API_KEY is not configured.');
        // Do not block the response, just log the configuration error
        return NextResponse.json({ message: `Return ${status} successfully (email not sent due to missing API key)`, order: updatedOrder });
      }
      const resend = new Resend(process.env.RESEND_API_KEY)
      try {
        await resend.emails.send({
          from: 'BUILD WITH AI <noreply@yourdomain.com>', // IMPORTANT: Replace with your verified domain
          to: customerEmail,
          subject: `Update on your return request for order #${order.stripeId.substring(0, 8)}`,
          react: ReturnStatusUpdateEmail({
            customerEmail,
            orderId: order.stripeId,
            returnStatus: status as 'approved' | 'rejected',
          }),
        })
        console.log(`Return status update email sent to ${customerEmail}`)
      } catch (emailError) {
        console.error('Email sending error:', emailError)
        // Do not fail the request if email sending fails, just log it
      }
    }
    return NextResponse.json({ message: `Return ${status} successfully`, order: updatedOrder })
  } catch (error) {
    console.error('Failed to update return status:', error)
    const errorMessage = error instanceof Error ? error.message : 'Internal server error'
    return new NextResponse(JSON.stringify({ error: errorMessage }), { status: 500 })
  }
}