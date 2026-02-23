import Groq from 'groq-sdk'
import { NextResponse } from 'next/server';

// Force Node.js runtime for better compatibility
export const runtime = 'nodejs'
export const maxDuration = 60 // 60 second timeout

// Simple keyword-based responses as fallback (no API key needed)
function getFallbackResponse(query: string) {
  const lowerQuery = query.toLowerCase()
  
  // Domain-related queries
  if (lowerQuery.includes('domain') || lowerQuery.includes('tld') || lowerQuery.includes('.com') || lowerQuery.includes('.ai')) {
    return {
      response: `**Domain Registration Services**

We offer domain registration with **1,500+ TLDs** including:
- **Popular TLDs**: .com, .net, .org, .io, .ai
- **New gTLDs**: .tech, .store, .app, .dev
- **Country TLDs**: .uk, .de, .fr, .in

**Features:**
- Instant domain search
- Domain transfer services
- Auto-renewal protection
- DNS management included

Would you like me to help you search for a specific domain?`,
      suggestions: ['Search for a domain', 'Transfer a domain', 'Domain pricing'],
    }
  }
  
  // SSL-related queries
  if (lowerQuery.includes('ssl') || lowerQuery.includes('certificate') || lowerQuery.includes('https') || lowerQuery.includes('security')) {
    return {
      response: `**SSL Certificate Services**

We provide comprehensive SSL solutions:

**Types Available:**
- **Domain Validation (DV)**: Basic encryption, instant issuance
- **Organization Validation (OV)**: Business verification included
- **Extended Validation (EV)**: Maximum trust, green address bar
- **Wildcard SSL**: Secure unlimited subdomains
- **Multi-Domain SSL**: Protect multiple domains with one certificate

**Features:**
- Zero-knowledge SSL (we don't store your private keys)
- Instant issuance for most certificates
- Free reissues
- Browser compatibility guarantee

Which type of SSL certificate are you interested in?`,
      suggestions: ['DV SSL pricing', 'Wildcard SSL', 'Multi-domain SSL'],
    }
  }
  
  // DNS-related queries
  if (lowerQuery.includes('dns') || lowerQuery.includes('nameserver') || lowerQuery.includes('hosting')) {
    return {
      response: `**DNS Hosting Services**

Our DNS infrastructure provides:

**Free DNS Hosting:**
- Unlimited DNS records
- 99.99% uptime SLA
- Instant propagation
- DDoS protection

**Premium DNS:**
- Advanced analytics
- GeoDNS routing
- DNSSEC support
- Priority support

**Features:**
- DNS templates for quick setup
- Custom nameserver groups
- API access for automation

Would you like to learn more about our DNS templates or premium features?`,
      suggestions: ['DNS templates', 'Premium DNS features', 'DNS pricing'],
    }
  }
  
  // Email-related queries
  if (lowerQuery.includes('email') || lowerQuery.includes('spam') || lowerQuery.includes('dmarc')) {
    return {
      response: `**Email Services**

Complete email protection and management:

**Email Verification:**
- Validate email addresses in real-time
- Reduce bounce rates
- Improve deliverability

**Spam Experts:**
- Inbound spam filtering (99.9% accuracy)
- Outbound spam monitoring
- Email archiving (30-day retention)

**EasyDMARC:**
- DMARC, SPF, DKIM setup
- Email authentication
- Phishing protection

Which email service would you like to explore?`,
      suggestions: ['Spam filtering', 'Email archiving', 'DMARC setup'],
    }
  }
  
  // Pricing/cost queries
  if (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('how much')) {
    return {
      response: `**Pricing Information**

Our pricing is competitive and transparent:

**Domains:**
- .com: ~$14.99/year
- .ai: ~$89.99/year
- .io: ~$59.99/year
- Pricing varies by TLD

**SSL Certificates:**
- Domain Validation: From $9.99/year
- Wildcard SSL: From $69.99/year
- Extended Validation: From $149.99/year

**DNS:**
- Free DNS Hosting: $0 (unlimited records)
- Premium DNS: From $4.99/month

**Email Services:**
- Spam Experts: From $3.99/month
- Email Archiving: From $2.99/month

Would you like specific pricing for a particular product?`,
      suggestions: ['Domain pricing', 'SSL pricing', 'Bundle deals'],
    }
  }
  
  // Default response
  return {
    response: `Hello! I'm **MARZ**, your AI assistant for BUILD WITH AI.

I can help you with:

**Products:**
- **Domain Registration** - 1,500+ TLDs available
- **SSL Certificates** - DV, OV, EV, Wildcard, Multi-Domain
- **DNS Hosting** - Free & Premium options
- **Email Services** - Verification, Spam filtering, DMARC
- **Hosting Licenses** - Plesk, Virtuozzo

**Services:**
- Customer Management
- Domain Management
- SSL Management
- AI Web Design

What would you like to work on today? Just ask me anything about domains, SSL, DNS, or our other services!`,
    suggestions: ['Register a domain', 'Get SSL certificate', 'DNS hosting', 'Email protection'],
  }
}

export async function POST(req: Request) {
  try {
    console.log('[MARZ] Received chat request')

    // Parse request body
    const { messages } = await req.json()
    const userQuery = messages?.[messages.length - 1]?.content

    if (!userQuery) {
      console.error('[MARZ] Missing user query in request')
      return new Response('Missing user query', { status: 400 })
    }

    console.log('[MARZ] Processing query:', userQuery)

    // Check for GROQ API key
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey || groqApiKey.trim() === '') {
      console.log('[MARZ] GROQ_API_KEY not configured, using fallback responses')
      // Use intelligent fallback responses (no API key needed)
      const fallbackResponse = getFallbackResponse(userQuery)
      return NextResponse.json({
        response: fallbackResponse.response,
        suggestions: fallbackResponse.suggestions,
        matches: [],
      })
    }

    // GROQ API key is configured - use AI
    const groq = new Groq({
      apiKey: groqApiKey,
    })

    // COMPACT system prompt - NO massive product catalog
    const systemPrompt = `You are MARZ, a friendly AI assistant for BUILD WITH AI.

**Quick Reference:**
- **Domains**: 1,500+ TLDs (.com, .ai, .io, etc.) - Registration, Transfer, Renewal
- **SSL**: Domain Validation, Organization Validation, Extended Validation, Wildcard, Multi-Domain, Code Signing
- **DNS**: Free DNS Hosting, Premium DNS, DNS Templates, Nameserver Groups
- **Email**: Email Verification, Email Templates, Spam Experts, EasyDMARC
- **Hosting**: Plesk Licenses, Virtuozzo Licenses, Templates Storefront
- **Services**: Customer Management, Domain Management, SSL Management, AI Web Design

Be conversational and helpful. Use markdown formatting. Keep responses concise. If asked about specific pricing or details you don't have, offer to help them find more information. After answering, you MUST generate 2-3 relevant follow-up questions as a JSON array string at the VERY END of your response, prefixed with "SUGGESTIONS:". For example: SUGGESTIONS:["What are its key features?", "How does pricing work?"]`

    const finalMessages = [
      { role: 'system', content: systemPrompt },
      ...messages,
    ]

    // Call the LLM with timeout handling
    console.log('[MARZ] Calling Groq API...')
    
    const response = await groq.chat.completions.create({
      model: 'llama3-8b-8192',
      messages: finalMessages,
    })
    const aiMessage = response.choices?.[0]?.message?.content || 'Sorry, no response.';
    // Extract suggestions if present
    let suggestions: string[] = [];
    const match = aiMessage.match(/SUGGESTIONS:(\[.*?\])$/);
    if (match) {
      try {
        suggestions = JSON.parse(match[1]);
      } catch {}
    }
    return NextResponse.json({
      response: aiMessage.replace(/SUGGESTIONS:(\[.*?\])$/, '').trim(),
      suggestions,
      matches: [],
    });
  } catch (error) {
    console.error('[MARZ API Error]:', error)
    
    // ALWAYS return a helpful response, NEVER show error to user
    // In case of a non-streaming error, return a generic error message.
    return new Response("I apologize, but I'm experiencing technical difficulties. Please try again later.", { status: 500 });
  }
}
