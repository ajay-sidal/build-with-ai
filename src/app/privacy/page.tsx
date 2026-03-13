import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Privacy Policy | BUILD WITH AI',
  description: 'Privacy Policy for BUILD WITH AI - Learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-6 px-6 py-16">
      <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-zinc-200">
        <ArrowLeft size={16} className="mr-2" />
        Back to Home
      </Link>

      <div className="prose prose-invert max-w-none">
        <h1 className="text-3xl font-semibold tracking-tight">Privacy Policy</h1>
        <p className="text-zinc-400">Last updated: February 22, 2026</p>

        <hr className="my-8 border-zinc-800" />

        <h2 className="text-xl font-medium">1. Introduction</h2>
        <p>
          BuildWithAI.digital ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services.
        </p>

        <h2 className="text-xl font-medium">2. Information We Collect</h2>
        <h3 className="text-lg font-medium">2.1 Personal Information</h3>
        <p>We may collect personal information that you voluntarily provide to us when you:</p>
        <ul>
          <li>Register for an account</li>
          <li>Purchase domains, SSL certificates, or other services</li>
          <li>Subscribe to our newsletter</li>
          <li>Contact our support team</li>
          <li>Participate in surveys or promotions</li>
        </ul>
        <p>This information may include:</p>
        <ul>
          <li>Name and contact information (email, phone number, address)</li>
          <li>Payment information (credit card details, billing address)</li>
          <li>Account credentials</li>
          <li>Domain registration information (as required by ICANN)</li>
        </ul>

        <h3 className="text-lg font-medium">2.2 Automatically Collected Information</h3>
        <p>When you visit our website, we may automatically collect certain information about your device and browsing activities, including:</p>
        <ul>
          <li>IP address and browser type</li>
          <li>Operating system and device information</li>
          <li>Pages visited and time spent on pages</li>
          <li>Referring website addresses</li>
          <li>Cookies and similar tracking technologies</li>
        </ul>

        <h2 className="text-xl font-medium">3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Process transactions and send related information</li>
          <li>Send promotional communications (with your consent)</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Monitor and analyze trends, usage, and activities</li>
          <li>Protect the security and integrity of our services</li>
          <li>Comply with legal obligations (including ICANN requirements)</li>
        </ul>

        <h2 className="text-xl font-medium">4. Information Sharing and Disclosure</h2>
        <p>We may share your information with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (payment processing, hosting, customer support)</li>
          <li><strong>Domain Registries:</strong> As required for domain registration (ICANN requirements)</li>
          <li><strong>Legal Authorities:</strong> When required by law or to protect our rights</li>
          <li><strong>Business Transfers:</strong> In connection with a merger, sale, or transfer of assets</li>
        </ul>
        <p>We do NOT sell your personal information to third parties.</p>

        <h2 className="text-xl font-medium">5. Data Security</h2>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information, including:
        </p>
        <ul>
          <li>Encryption of data in transit (SSL/TLS)</li>
          <li>Secure storage of sensitive information</li>
          <li>Regular security assessments and updates</li>
          <li>Access controls and authentication mechanisms</li>
        </ul>
        <p>However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.</p>

        <h2 className="text-xl font-medium">6. Cookies and Tracking</h2>
        <p>
          We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie settings through your browser preferences.
        </p>

        <h2 className="text-xl font-medium">7. Your Rights and Choices</h2>
        <p>Depending on your location, you may have the right to:</p>
        <ul>
          <li>Access your personal information</li>
          <li>Correct inaccurate information</li>
          <li>Delete your information (subject to legal obligations)</li>
          <li>Opt-out of marketing communications</li>
          <li>Request data portability</li>
        </ul>
        <p>To exercise these rights, please contact us at privacy@buildwithai.digital</p>

        <h2 className="text-xl font-medium">8. Data Retention</h2>
        <p>
          We retain your personal information for as long as necessary to provide our services, comply with legal obligations (including ICANN requirements for domain registrants), and resolve disputes.
        </p>

        <h2 className="text-xl font-medium">9. International Data Transfers</h2>
        <p>
          Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers.
        </p>

        <h2 className="text-xl font-medium">10. Children's Privacy</h2>
        <p>
          Our services are not directed to individuals under 18. We do not knowingly collect personal information from children.
        </p>

        <h2 className="text-xl font-medium">11. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
        </p>

        <h2 className="text-xl font-medium">12. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
        </p>
        <ul>
          <li>Email: privacy@buildwithai.digital</li>
          <li>Address: BuildWithAI.digital, [Your Business Address]</li>
        </ul>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-zinc-950/50 p-6">
          <p className="text-sm text-zinc-400">
            <strong>Note:</strong> This is a template privacy policy. Please consult with legal counsel to ensure compliance with applicable laws (GDPR, CCPA, etc.) and customize for your specific business practices.
          </p>
        </div>
      </div>
    </main>
  )
}
