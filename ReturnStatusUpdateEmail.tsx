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
  Button,
} from '@react-email/components'
import * as React from 'react'

interface ReturnStatusUpdateEmailProps {
  customerEmail: string
  orderId: string
  returnStatus: 'approved' | 'rejected'
}

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital'

export const ReturnStatusUpdateEmail: React.FC<Readonly<ReturnStatusUpdateEmailProps>> = ({
  customerEmail,
  orderId,
  returnStatus,
}) => {
  const isApproved = returnStatus === 'approved'
  const subject = isApproved ? 'Your Return Request has been Approved' : 'Update on Your Return Request'
  const headingText = isApproved ? 'Return Approved' : 'Return Request Update'
  const mainText = isApproved
    ? `We have approved your return request for order #${orderId.substring(0, 8)}. Please follow the instructions provided in your dashboard to complete the return process.`
    : `We have reviewed your return request for order #${orderId.substring(0, 8)} and unfortunately, it has been rejected. Please see your dashboard for more details, or contact support if you have any questions.`

  return (
    <Html>
      <Head />
      <Preview>{subject}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Img src={`${baseUrl}/icon.png`} width="48" height="48" alt="BUILD WITH AI Logo" />
          </Section>
          <Heading style={h1}>{headingText}</Heading>
          <Text style={paragraph}>
            Hi {customerEmail.split('@')[0]},
          </Text>
          <Text style={paragraph}>{mainText}</Text>
          <Section style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px' }}>
            <Button style={button} href={`${baseUrl}/dashboard/orders/${orderId}`}>
              View Order Details
            </Button>
          </Section>
          <Text style={paragraph}>
            If you have any questions, please don't hesitate to contact our support team.
          </Text>
          <Text style={paragraph}>
            Thanks,
            <br />
            The BUILD WITH AI Team
          </Text>
          <Hr style={hr} />
          <Text style={footer}>BUILD WITH AI, 123 Innovation Drive, Tech City, 12345</Text>
        </Container>
      </Body>
    </Html>
  )
}

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