import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Terms of Service | BUILD WITH AI',
  description: 'Terms of Service for BUILD WITH AI - Read our terms and conditions for using our services.',
}

export default function TermsOfServicePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>

      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-semibold tracking-tight">Terms of Service</h1>
        <p className="text-zinc-400">Last updated: February 22, 2026</p>

        <hr className="my-8 border-zinc-800" />

        <h2 className="text-xl font-medium">1. Acceptance of Terms</h2>
        <p>
          By accessing or using BuildWithAI.digital ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use the Service.
        </p>

        <h2 className="text-xl font-medium">2. Description of Service</h2>
        <p>
          BuildWithAI.digital provides domain registration, SSL certificates, DNS hosting, and related infrastructure services powered by OpenProvider. We act as a reseller and intermediary for these services.
        </p>

        <h2 className="text-xl font-medium">3. Account Registration</h2>
        <p>To use certain features of the Service, you must:</p>
        <ul>
          <li>Be at least 18 years old</li>
          <li>Provide accurate and complete registration information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Notify us immediately of any unauthorized access</li>
        </ul>
        <p>You are responsible for all activities that occur under your account.</p>

        <h2 className="text-xl font-medium">4. Domain Registration Terms</h2>
        <h3 className="text-lg font-medium">4.1 ICANN Compliance</h3>
        <p>
          Domain registrations are subject to ICANN (Internet Corporation for Assigned Names and Numbers) policies and the policies of applicable domain registries. You agree to comply with all such policies.
        </p>

        <h3 className="text-lg font-medium">4.2 Domain Ownership</h3>
        <p>
          You acknowledge that domain registration does not guarantee permanent ownership. Domains must be renewed according to registry rules, and failure to renew may result in loss of the domain.
        </p>

        <h3 className="text-lg font-medium">4.3 Accurate Information</h3>
        <p>
          You must provide accurate WHOIS information for domain registrations. Providing false information may result in domain suspension or cancellation.
        </p>

        <h3 className="text-lg font-medium">4.4 Prohibited Uses</h3>
        <p>You may not register or use domains for:</p>
        <ul>
          <li>Trademark infringement</li>
          <li>Phishing or fraud</li>
          <li>Malware distribution</li>
          <li>Spam or unsolicited communications</li>
          <li>Any illegal activities</li>
        </ul>

        <h2 className="text-xl font-medium">5. SSL Certificate Terms</h2>
        <p>
          SSL certificates are issued by Certificate Authorities (CAs). You agree to:
        </p>
        <ul>
          <li>Provide accurate domain ownership information</li>
          <li>Use certificates only for domains you own or control</li>
          <li>Comply with CA/Browser Forum requirements</li>
          <li>Renew certificates before expiration</li>
        </ul>

        <h2 className="text-xl font-medium">6. Payment and Billing</h2>
        <h3 className="text-lg font-medium">6.1 Pricing</h3>
        <p>
          All prices are in USD unless otherwise stated. Prices are subject to change with notice. Renewal prices may differ from initial registration prices.
        </p>

        <h3 className="text-lg font-medium">6.2 Payment Methods</h3>
        <p>
          We accept payments through Stripe. You authorize us to charge your payment method for all purchases and recurring services.
        </p>

        <h3 className="text-lg font-medium">6.3 Refunds</h3>
        <p>
          Refund policies vary by product:
        </p>
        <ul>
          <li><strong>Domains:</strong> Generally non-refundable after grace period (typically 5 days)</li>
          <li><strong>SSL Certificates:</strong> May be refunded within 30 days if not yet issued</li>
          <li><strong>Other services:</strong> Case-by-case basis</li>
        </ul>

        <h3 className="text-lg font-medium">6.4 Auto-Renewal</h3>
        <p>
          Many services are set to auto-renew by default. You can disable auto-renewal in your account settings. We are not responsible for services that expire due to disabled auto-renewal.
        </p>

        <h2 className="text-xl font-medium">7. Acceptable Use Policy</h2>
        <p>You may not use the Service to:</p>
        <ul>
          <li>Violate any applicable laws or regulations</li>
          <li>Infringe intellectual property rights</li>
          <li>Transmit harmful code or malware</li>
          <li>Engage in spam or unsolicited marketing</li>
          <li>Attempt unauthorized access to systems</li>
          <li>Interfere with the Service's operation</li>
          <li>Resell services without authorization</li>
        </ul>

        <h2 className="text-xl font-medium">8. Intellectual Property</h2>
        <p>
          The Service, including its content, features, and functionality, is owned by BuildWithAI.digital and is protected by copyright, trademark, and other intellectual property laws.
        </p>

        <h2 className="text-xl font-medium">9. Disclaimers</h2>
        <p>
          THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        </p>

        <h2 className="text-xl font-medium">10. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, BUILDWITHAI.DIGITAL SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, DATA, OR REVENUES, ARISING FROM YOUR USE OF THE SERVICE.
        </p>
        <p>
          OUR TOTAL LIABILITY FOR ANY CLAIM RELATED TO THE SERVICE SHALL NOT EXCEED THE AMOUNT YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
        </p>

        <h2 className="text-xl font-medium">11. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless BuildWithAI.digital, its affiliates, and their respective officers, directors, employees, and agents from any claims, damages, or expenses arising from your use of the Service or violation of these Terms.
        </p>

        <h2 className="text-xl font-medium">12. Termination</h2>
        <p>
          We may terminate or suspend your account and access to the Service at our discretion, with or without cause, with or without notice.
        </p>

        <h2 className="text-xl font-medium">13. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to conflict of law principles.
        </p>

        <h2 className="text-xl font-medium">14. Dispute Resolution</h2>
        <p>
          Any disputes arising from these Terms or the Service shall be resolved through binding arbitration in accordance with the rules of [Arbitration Organization]. The arbitration shall take place in [Your City, State].
        </p>

        <h2 className="text-xl font-medium">15. Changes to Terms</h2>
        <p>
          We may modify these Terms at any time. Continued use of the Service after changes constitutes acceptance of the new Terms.
        </p>

        <h2 className="text-xl font-medium">16. Contact Information</h2>
        <p>
          For questions about these Terms, please contact us at:
        </p>
        <ul>
          <li>Email: legal@buildwithai.digital</li>
          <li>Address: BuildWithAI.digital, [Your Business Address]</li>
        </ul>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
          <p className="text-sm text-zinc-400">
            <strong>Note:</strong> This is a template terms of service. Please consult with legal counsel to ensure compliance with applicable laws and customize for your specific business practices, jurisdiction, and services.
          </p>
        </div>
      </div>
    </main>
  )
}
