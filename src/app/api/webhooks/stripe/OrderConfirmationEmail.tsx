import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Hr,
  Row,
  Column,
  Button,
} from '@react-email/components'
import * as React from 'react'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface OrderConfirmationEmailProps {
  customerEmail: string
  orderTotal: number
  orderId: string
  orderItems: OrderItem[]
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital'

export const OrderConfirmationEmail: React.FC<Readonly<OrderConfirmationEmailProps>> = ({
  customerEmail,
  orderTotal,
  orderId,
  orderItems,
}) => (
  <Html>
    <Head />
    <Preview>Your BUILD WITH AI Order Confirmation</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img src={`${baseUrl}/icon.png`} width="48" height="48" alt="BUILD WITH AI Logo" />
        </Section>
        <Heading style={h1}>Thank you for your order!</Heading>
        <Text style={paragraph}>
          Hi {customerEmail.split('@')[0]},
        </Text>
        <Text style={paragraph}>
          We're getting your order ready to be provisioned. We will notify you once your products and services are active in your dashboard. You can view your order details and status at any time.
        </Text>
        <Section style={summarySection}>
          <Heading as="h2" style={summaryHeader}>Order Summary</Heading>
          <Hr style={hr} />
          {orderItems.map((item, index) => (
            <Row key={index} style={itemRow}>
              <Column>
                <Text style={itemText}>{item.name} (x{item.quantity})</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={itemText}>${(item.price * item.quantity).toFixed(2)}</Text>
              </Column>
            </Row>
          ))}
          <Hr style={hr} />
          <Row style={itemRow}>
            <Column>
              <Text style={totalText}><strong>Order Total:</strong></Text>
            </Column>
            <Column style={{ textAlign: 'right' }}>
              <Text style={totalText}><strong>${orderTotal.toFixed(2)}</strong></Text>
            </Column>
          </Row>
          <Text style={summaryItem}>
            <strong>Order ID:</strong> {orderId.substring(0, 8)}
          </Text>
        </Section>
        <Section style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
          <Button
            style={button}
            href={`${baseUrl}/dashboard/orders/${orderId}`}
          >
            View Order Details
          </Button>
        </Section>
        <Text style={paragraph}>
          Thanks,
          <br />
          The BUILD WITH AI Team
        </Text>
        <Hr style={hr} />
        <Text style={footer}>
          BUILD WITH AI, 123 Innovation Drive, Tech City, 12345
        </Text>
      </Container>
    </Body>
  </Html>
)

const main = {
  backgroundColor: '#111827',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  color: '#f9fafb',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
}

const logoContainer = {
  textAlign: 'center' as const,
}

const h1 = {
  fontSize: '32px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
}

const paragraph = {
  fontSize: '16px',
  lineHeight: '24px',
}

const summarySection = {
  backgroundColor: '#1f2937',
  borderRadius: '8px',
  padding: '20px',
  margin: '20px 0',
}

const summaryHeader = {
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 10px 0',
}

const itemRow = { width: '100%' }
const itemText = { fontSize: '14px', color: '#d1d5db' }
const totalText = { fontSize: '16px', fontWeight: 'bold' }

const summaryItem = {
  fontSize: '12px',
  color: '#9ca3af',
  marginTop: '10px',
}

const hr = {
  borderColor: '#374151',
  margin: '20px 0',
}

const footer = {
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '16px',
}

const button = {
  backgroundColor: '#0d6efd',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 20px',
}