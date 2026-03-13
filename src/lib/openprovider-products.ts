/**
 * OpenProvider Products & Services Data
 * Comprehensive catalog of all products and services available through OpenProvider API
 */

export interface Product {
  id: string
  name: string
  slug: string
  category: string
  subcategory?: string
  description: string
  benefits: string[]
  features: string[]
  pricing?: {
    startingFrom: string
    currency: string
    period: string
    tiers?: PricingTier[]
  }
  cta: {
    primary: string
    secondary: string
    url: string
  }
  icon: string
  popular?: boolean
  new?: boolean
}

export interface PricingTier {
  name: string
  price: string
  features: string[]
}

export interface Service {
  id: string
  name: string
  slug: string
  description: string
  features: string[]
  benefits: string[]
  useCases: string[]
  cta: {
    primary: string
    url: string
  }
}

// ===== DOMAINS =====
export const domainProducts: Product[] = [
  {
    id: 'domain-registration',
    name: 'Domain Registration',
    slug: 'domain-registration',
    category: 'Domains',
    description: 'Register your perfect domain name from over 1,500+ TLDs worldwide. Instant activation, competitive pricing, and comprehensive management tools.',
    benefits: [
      'Access to 1,500+ TLDs including .com, .net, .org, and country-specific extensions',
      'Instant domain activation and DNS propagation',
      'Competitive wholesale pricing with volume discounts',
      'Free WHOIS privacy protection on supported TLDs',
      'Automatic renewal options to prevent expiration',
      'Bulk registration capabilities for agencies',
    ],
    features: [
      'Real-time domain availability checking',
      'Domain suggestion engine powered by AI',
      'Premium domain marketplace access',
      'IDN (Internationalized Domain Names) support',
      'Sunrise and landrush period participation',
      'API-driven bulk registration',
      'Auto-renewal management',
      'Domain lock protection',
      'Transfer authorization codes',
    ],
    pricing: {
      startingFrom: '8.06',
      currency: 'USD',
      period: 'per year',
      tiers: [
        { name: 'Standard TLDs (.com, .net)', price: '$8.06/year', features: ['Most popular extensions', 'Free DNS management'] },
        { name: 'Premium TLDs (.io, .ai)', price: '$35.00/year', features: ['Tech-focused extensions', 'Enhanced features'] },
        { name: 'Country Code TLDs', price: 'Varies', features: ['Local presence options', 'Regional targeting'] },
      ],
    },
    cta: {
      primary: 'Search Domains',
      secondary: 'View All Extensions',
      url: '/',
    },
    icon: 'globe',
    popular: true,
  },
  {
    id: 'domain-transfer',
    name: 'Domain Transfer',
    slug: 'domain-transfer',
    category: 'Domains',
    description: 'Seamlessly transfer your domains from any registrar to OpenProvider. Enjoy better pricing, superior support, and advanced management features.',
    benefits: [
      'Free 1-year extension with every transfer',
      'No downtime during transfer process',
      'Competitive transfer pricing',
      'Dedicated transfer support team',
      'Bulk transfer capabilities',
      'Automatic DNS preservation',
    ],
    features: [
      'Simple 5-step transfer process',
      'Real-time transfer status tracking',
      'Auth code management',
      'Automatic contact migration',
      'DNS record preservation',
      'Transfer lock management',
      'FOA (Form of Authorization) handling',
      'Registry-level transfer tracking',
    ],
    pricing: {
      startingFrom: '8.06',
      currency: 'USD',
      period: 'per transfer',
    },
    cta: {
      primary: 'Transfer Domain',
      secondary: 'Learn More',
      url: '/',
    },
    icon: 'arrow-right-left',
  },
  {
    id: 'domain-renewal',
    name: 'Domain Renewal',
    slug: 'domain-renewal',
    category: 'Domains',
    description: 'Keep your valuable domains active with our automated renewal system. Never lose a domain to expiration again.',
    benefits: [
      'Automatic renewal protection',
      'Flexible renewal periods (1-10 years)',
      'Grace period recovery options',
      'Bulk renewal management',
      'Renewal reminders and notifications',
      'Competitive renewal pricing',
    ],
    features: [
      'Auto-renewal toggle per domain',
      'Multi-year renewal discounts',
      'Expiration monitoring',
      'Grace period management',
      'Redemption period support',
      'Renewal history tracking',
      'Invoice management',
    ],
    pricing: {
      startingFrom: '8.06',
      currency: 'USD',
      period: 'per year',
    },
    cta: {
      primary: 'Renew Now',
      secondary: 'Manage Renewals',
      url: '/dashboard/billing',
    },
    icon: 'refresh-cw',
  },
  {
    id: 'premium-dns',
    name: 'Premium DNS',
    slug: 'premium-dns',
    category: 'Domains',
    description: 'Enterprise-grade DNS infrastructure powered by Sectigo. 100% uptime SLA, DDoS protection, and global anycast network.',
    benefits: [
      '99.999% uptime guarantee',
      'Global anycast network for fast resolution',
      'DDoS attack mitigation',
      'DNSSEC support included',
      'Real-time DNS propagation',
      'Advanced analytics and reporting',
    ],
    features: [
      'Sectigo Premium DNS infrastructure',
      'Anycast network with 20+ PoPs',
      'DNSSEC signing and validation',
      'DDoS protection up to 1Tbps',
      'Real-time DNS updates',
      'API-driven management',
      'Detailed query analytics',
      'GeoDNS capabilities',
      'DNS failover',
    ],
    pricing: {
      startingFrom: '4.99',
      currency: 'USD',
      period: 'per month',
    },
    cta: {
      primary: 'Enable Premium DNS',
      secondary: 'View Features',
      url: '/products/dns/hosting',
    },
    icon: 'shield',
    new: true,
  },
]

// ===== SSL CERTIFICATES =====
export const sslProducts: Product[] = [
  {
    id: 'domain-validation-ssl',
    name: 'Domain Validation SSL',
    slug: 'domain-validation-ssl',
    category: 'SSL Certificates',
    subcategory: 'Domain Validation',
    description: 'Secure your website with fast, affordable domain-validated SSL certificates. Perfect for blogs, portfolios, and small business websites.',
    benefits: [
      'Instant issuance (minutes)',
      'Basic domain validation only',
      '256-bit encryption',
      'Browser trust indicator',
      'SEO ranking boost',
      'Mobile-friendly security',
    ],
    features: [
      'Single domain coverage',
      'www and non-www coverage',
      '2048-bit CSR support',
      'SHA-2 signature algorithm',
      'Unlimited server licenses',
      '90-day money-back guarantee',
      'Free reissues during validity',
      'Compatible with all browsers',
    ],
    pricing: {
      startingFrom: '9.99',
      currency: 'USD',
      period: 'per year',
      tiers: [
        { name: 'RapidSSL', price: '$9.99/year', features: ['Basic DV', 'Single domain', '1 year validity'] },
        { name: 'Comodo EssentialSSL', price: '$14.99/year', features: ['Enhanced DV', 'Single domain', '1-2 years'] },
        { name: 'GeoTrust QuickSSL', price: '$12.99/year', features: ['Fast issuance', 'Single domain', '1 year'] },
      ],
    },
    cta: {
      primary: 'Get SSL',
      secondary: 'Compare Options',
      url: '/ssl',
    },
    icon: 'lock',
    popular: true,
  },
  {
    id: 'organization-validation-ssl',
    name: 'Organization Validation SSL',
    slug: 'organization-validation-ssl',
    category: 'SSL Certificates',
    subcategory: 'Organization Validation',
    description: 'Display your company name in the certificate details. Ideal for business websites, e-commerce stores, and corporate portals.',
    benefits: [
      'Company name verification',
      'Enhanced trust indicators',
      'Business validation badge',
      'Higher warranty coverage',
      'Multi-domain options available',
      'Wildcard support available',
    ],
    features: [
      'Organization verification',
      'Company name in certificate',
      'Business validation documents',
      'Phone verification included',
      'Higher warranty ($500K+)',
      'Multi-domain support',
      'Wildcard options',
      '2-year validity option',
    ],
    pricing: {
      startingFrom: '49.99',
      currency: 'USD',
      period: 'per year',
      tiers: [
        { name: 'Comodo OV SSL', price: '$49.99/year', features: ['Organization validation', 'Single domain', '$500K warranty'] },
        { name: 'GeoTrust True BusinessID', price: '$59.99/year', features: ['Business validation', 'Single/Wildcard', '$1M warranty'] },
        { name: 'DigiCert Secure Site', price: '$199/year', features: ['Premium OV', 'Multi-domain', '$1.5M warranty'] },
      ],
    },
    cta: {
      primary: 'Get OV SSL',
      secondary: 'Learn More',
      url: '/ssl',
    },
    icon: 'building',
  },
  {
    id: 'extended-validation-ssl',
    name: 'Extended Validation SSL',
    slug: 'extended-validation-ssl',
    category: 'SSL Certificates',
    subcategory: 'Extended Validation',
    description: 'The highest level of SSL validation. Display your company name in the browser address bar with the green padlock. Maximum trust for e-commerce and financial sites.',
    benefits: [
      'Green address bar (legacy browsers)',
      'Company name prominently displayed',
      'Highest level of validation',
      'Maximum warranty coverage',
      'Enhanced customer trust',
      'Reduced cart abandonment',
    ],
    features: [
      'Rigorous business verification',
      'Legal entity validation',
      'Physical address verification',
      'Phone verification required',
      'Highest warranty ($1.75M+)',
      'Multi-domain support',
      'Wildcard options available',
      'Priority support included',
    ],
    pricing: {
      startingFrom: '149.99',
      currency: 'USD',
      period: 'per year',
      tiers: [
        { name: 'Comodo EV SSL', price: '$149.99/year', features: ['Extended validation', 'Single domain', '$1.75M warranty'] },
        { name: 'DigiCert EV', price: '$299/year', features: ['Premium EV', 'Multi-domain', '$1.75M warranty'] },
        { name: 'GeoTrust EV', price: '$179/year', features: ['Business EV', 'Single/Wildcard', '$1.5M warranty'] },
      ],
    },
    cta: {
      primary: 'Get EV SSL',
      secondary: 'Compare EV Options',
      url: '/ssl',
    },
    icon: 'shield-check',
  },
  {
    id: 'wildcard-ssl',
    name: 'Wildcard SSL',
    slug: 'wildcard-ssl',
    category: 'SSL Certificates',
    subcategory: 'Wildcard',
    description: 'Secure unlimited subdomains with a single certificate. Perfect for SaaS platforms, multi-tenant applications, and growing businesses.',
    benefits: [
      'Unlimited subdomain coverage',
      'Single certificate management',
      'Cost-effective for multiple subdomains',
      'Easy scalability',
      'All validation levels available',
      'Compatible with all servers',
    ],
    features: [
      '*.yourdomain.com coverage',
      'Unlimited subdomains',
      'DV, OV, EV options',
      'Single CSR management',
      'Free reissues',
      'Server license unlimited',
      '256-bit encryption',
    ],
    pricing: {
      startingFrom: '69.99',
      currency: 'USD',
      period: 'per year',
      tiers: [
        { name: 'RapidSSL Wildcard', price: '$69.99/year', features: ['DV Wildcard', 'Unlimited subdomains', '1 year'] },
        { name: 'Comodo Wildcard', price: '$89.99/year', features: ['DV Wildcard', 'Unlimited subdomains', '1-2 years'] },
        { name: 'GeoTrust Wildcard', price: '$149/year', features: ['OV Wildcard', 'Unlimited subdomains', '$1M warranty'] },
      ],
    },
    cta: {
      primary: 'Get Wildcard SSL',
      secondary: 'View Pricing',
      url: '/ssl',
    },
    icon: 'asterisk',
  },
  {
    id: 'multi-domain-ssl',
    name: 'Multi-Domain SSL (SAN)',
    slug: 'multi-domain-ssl',
    category: 'SSL Certificates',
    subcategory: 'Multi-Domain',
    description: 'Secure multiple domains with a single certificate. Support for up to 250 domains across different TLDs and subdomains.',
    benefits: [
      'Up to 250 domains in one certificate',
      'Mixed domain types supported',
      'Single management interface',
      'Cost savings vs individual certs',
      'All validation levels available',
      'Easy domain addition/removal',
    ],
    features: [
      'Multiple domain coverage',
      'Different TLDs supported',
      'Subdomain support',
      'DV, OV, EV options',
      'Add/remove SANs anytime',
      'Single expiration date',
      'Unified management',
    ],
    pricing: {
      startingFrom: '99.99',
      currency: 'USD',
      period: 'per year',
      tiers: [
        { name: 'Comodo Multi-Domain', price: '$99.99/year', features: ['3 domains included', 'Up to 100 SANs', 'DV'] },
        { name: 'DigiCert Multi-Domain', price: '$249/year', features: ['5 domains included', 'Up to 250 SANs', 'OV/EV'] },
        { name: 'GeoTrust Multi-Domain', price: '$129/year', features: ['5 domains included', 'Up to 100 SANs', 'OV'] },
      ],
    },
    cta: {
      primary: 'Get Multi-Domain SSL',
      secondary: 'Compare Plans',
      url: '/ssl',
    },
    icon: 'layers',
  },
  {
    id: 'code-signing',
    name: 'Code Signing Certificate',
    slug: 'code-signing',
    category: 'SSL Certificates',
    subcategory: 'Code Signing',
    description: 'Sign your software, applications, and scripts to verify authenticity and prevent security warnings. Essential for software publishers.',
    benefits: [
      'Eliminate "Unknown Publisher" warnings',
      'Verify software authenticity',
      'Timestamp support for long-term validity',
      'Compatible with Microsoft, Java, Adobe',
      'Increased download confidence',
      'Malware protection indicator',
    ],
    features: [
      'Microsoft Authenticode',
      'Java code signing',
      'Adobe AIR signing',
      'Timestamp server included',
      'Hardware token (EV)',
      'Instant timestamping',
      'Unlimited signatures',
    ],
    pricing: {
      startingFrom: '89.99',
      currency: 'USD',
      period: 'per year',
      tiers: [
        { name: 'Standard Code Signing', price: '$89.99/year', features: ['Basic signing', 'Timestamp included', '1 year'] },
        { name: 'EV Code Signing', price: '$299/year', features: ['EV validation', 'Hardware token', 'SmartScreen reputation'] },
        { name: 'Microsoft IHV', price: '$199/year', features: ['Kernel driver signing', 'WHQL compatible', '2 years'] },
      ],
    },
    cta: {
      primary: 'Get Code Signing',
      secondary: 'Learn More',
      url: '/ssl',
    },
    icon: 'file-code',
  },
  {
    id: 'email-signing',
    name: 'S/MIME Email Certificate',
    slug: 'email-signing',
    category: 'SSL Certificates',
    subcategory: 'Email Security',
    description: 'Digitally sign and encrypt emails to protect sensitive communications. Verify sender identity and ensure message integrity.',
    benefits: [
      'Email encryption',
      'Digital signatures',
      'Sender verification',
      'Message integrity',
      'Non-repudiation',
      'Outlook/Thunderbird compatible',
    ],
    features: [
      'S/MIME protocol',
      '256-bit encryption',
      'Digital signature',
      'Certificate-based auth',
      'Email client integration',
      'Contact sharing',
      '1-3 year validity',
    ],
    pricing: {
      startingFrom: '19.99',
      currency: 'USD',
      period: 'per year',
    },
    cta: {
      primary: 'Get Email Certificate',
      secondary: 'View Features',
      url: '/ssl',
    },
    icon: 'mail',
  },
]

// ===== DNS SERVICES =====
export const dnsProducts: Product[] = [
  {
    id: 'dns-hosting',
    name: 'DNS Hosting',
    slug: 'dns-hosting',
    category: 'DNS Services',
    description: 'Free, reliable DNS hosting with global anycast network. Manage all your DNS records through an intuitive interface or API.',
    benefits: [
      '100% free with domain registration',
      'Global anycast network',
      'Fast DNS propagation',
      '99.99% uptime',
      'DDoS protection',
      'API-driven management',
    ],
    features: [
      'All record types (A, AAAA, CNAME, MX, TXT, SRV, CAA, etc.)',
      'DNSSEC support',
      'Custom nameservers',
      'DNS templates',
      'Zone file import/export',
      'Real-time updates',
      'Query analytics',
      'API access',
    ],
    pricing: {
      startingFrom: '0',
      currency: 'USD',
      period: 'free',
    },
    cta: {
      primary: 'Manage DNS',
      secondary: 'Learn More',
      url: '/products/dns/hosting',
    },
    icon: 'server',
    popular: true,
  },
  {
    id: 'dns-templates',
    name: 'DNS Templates',
    slug: 'dns-templates',
    category: 'DNS Services',
    description: 'Pre-configured DNS templates for popular services. Deploy standard configurations instantly across multiple domains.',
    benefits: [
      'One-click DNS setup',
      'Pre-validated configurations',
      'Consistent DNS across domains',
      'Time-saving automation',
      'Error-free deployment',
      'Custom template creation',
    ],
    features: [
      'Website templates (WordPress, Shopify, etc.)',
      'Email templates (Google Workspace, Office 365)',
      'CDN templates (Cloudflare, Akamai)',
      'Custom template builder',
      'Bulk template application',
      'Template sharing',
      'Version control',
    ],
    pricing: {
      startingFrom: '0',
      currency: 'USD',
      period: 'free',
    },
    cta: {
      primary: 'Browse Templates',
      secondary: 'Create Custom',
      url: '/products/dns/templates',
    },
    icon: 'file-template',
  },
  {
    id: 'nameserver-groups',
    name: 'Nameserver Groups',
    slug: 'nameserver-groups',
    category: 'DNS Services',
    description: 'Create and manage custom nameserver groups for advanced DNS configurations. Perfect for agencies and resellers.',
    benefits: [
      'Custom nameserver branding',
      'Group-based management',
      'Bulk operations',
      'Reseller-friendly',
      'API automation',
      'High availability',
    ],
    features: [
      'Custom nameserver names',
      'Multiple IP support',
      'IPv6 support',
      'Geographic distribution',
      'Health monitoring',
      'Automatic failover',
      'API management',
    ],
    pricing: {
      startingFrom: '0',
      currency: 'USD',
      period: 'free',
    },
    cta: {
      primary: 'Create Group',
      secondary: 'Learn More',
      url: '/products/dns/nameservers',
    },
    icon: 'network',
  },
]

// ===== EMAIL SERVICES =====
export const emailProducts: Product[] = [
  {
    id: 'email-verification',
    name: 'Email Verification',
    slug: 'email-verification',
    category: 'Email Services',
    description: 'Verify domain ownership and customer email addresses. ICANN-compliant verification for all domain registrations.',
    benefits: [
      'ICANN compliance',
      'Prevent domain suspension',
      'Automated verification flows',
      'Customizable email templates',
      'Multi-language support',
      'API integration',
    ],
    features: [
      'Domain ownership verification',
      'Customer email verification',
      'Automated reminders',
      'Custom email templates',
      'Verification status tracking',
      'Bulk verification',
      'API webhooks',
      'Compliance reporting',
    ],
    pricing: {
      startingFrom: '0',
      currency: 'USD',
      period: 'included',
    },
    cta: {
      primary: 'Verify Email',
      secondary: 'Learn More',
      url: '/products/email/verification',
    },
    icon: 'mail-check',
  },
  {
    id: 'email-templates',
    name: 'Email Templates',
    slug: 'email-templates',
    category: 'Email Services',
    description: 'Customize transactional emails for your brand. ICANN-mandated emails (WDRP, ERRP, FOA) and custom notifications.',
    benefits: [
      'Brand consistency',
      'Improved deliverability',
      'Multi-language support',
      'ICANN compliance',
      'A/B testing capability',
      'Analytics tracking',
    ],
    features: [
      'WDRP templates',
      'ERRP templates',
      'FOA templates',
      'Custom notifications',
      'HTML editor',
      'Variable substitution',
      'Preview mode',
      'Version history',
    ],
    pricing: {
      startingFrom: '0',
      currency: 'USD',
      period: 'included',
    },
    cta: {
      primary: 'Customize Templates',
      secondary: 'View Examples',
      url: '/products/email/templates',
    },
    icon: 'file-text',
  },
]

// ===== SPAM EXPERTS =====
export const spamExpertsProducts: Product[] = [
  {
    id: 'incoming-filter',
    name: 'Incoming Email Filter',
    slug: 'incoming-filter',
    category: 'Spam Experts',
    description: 'Advanced inbound spam filtering with 99%+ accuracy. Protect your inbox from spam, viruses, and phishing attacks.',
    benefits: [
      '99%+ spam detection rate',
      'Zero false positives guarantee',
      'Real-time threat protection',
      'Reduced bandwidth usage',
      'Clean email delivery',
      'Detailed reporting',
    ],
    features: [
      'Advanced spam filtering',
      'Virus protection',
      'Phishing detection',
      'Attachment filtering',
      'Content filtering',
      'Allow/block lists',
      'Quarantine management',
      'Email continuity',
    ],
    pricing: {
      startingFrom: '2.99',
      currency: 'USD',
      period: 'per mailbox/month',
    },
    cta: {
      primary: 'Enable Filtering',
      secondary: 'View Demo',
      url: '/products/spam-experts',
    },
    icon: 'shield-alert',
    popular: true,
  },
  {
    id: 'outgoing-filter',
    name: 'Outgoing Email Filter',
    slug: 'outgoing-filter',
    category: 'Spam Experts',
    description: 'Monitor and filter outgoing emails to prevent spam outbreaks and protect your sender reputation.',
    benefits: [
      'Prevent spam outbreaks',
      'Protect sender reputation',
      'Detect compromised accounts',
      'Policy enforcement',
      'Compliance monitoring',
      'Detailed logging',
    ],
    features: [
      'Outbound spam detection',
      'Account compromise alerts',
      'Rate limiting',
      'Content scanning',
      'Policy enforcement',
      'Audit logging',
      'Reporting dashboard',
      'Alert notifications',
    ],
    pricing: {
      startingFrom: '0.99',
      currency: 'USD',
      period: 'per mailbox/month',
    },
    cta: {
      primary: 'Enable Outbound',
      secondary: 'Learn More',
      url: '/products/spam-experts',
    },
    icon: 'send',
  },
  {
    id: 'email-archiving',
    name: 'Email Archiving',
    slug: 'email-archiving',
    category: 'Spam Experts',
    description: 'Compliant email archiving with instant search and retrieval. Meet regulatory requirements and protect against data loss.',
    benefits: [
      'Regulatory compliance',
      'Instant email retrieval',
      'Legal hold capabilities',
      'Disaster recovery',
      'eDiscovery support',
      'Unlimited storage',
    ],
    features: [
      'Automatic archiving',
      'Full-text search',
      'Legal hold',
      'Audit trails',
      'Export capabilities',
      'Retention policies',
      'Role-based access',
      'API access',
    ],
    pricing: {
      startingFrom: '1.99',
      currency: 'USD',
      period: 'per mailbox/month',
    },
    cta: {
      primary: 'Start Archiving',
      secondary: 'View Features',
      url: '/products/spam-experts',
    },
    icon: 'archive',
  },
]

// ===== EASY DMARC =====
export const easyDmarcProducts: Product[] = [
  {
    id: 'easy-dmarc',
    name: 'EasyDMARC',
    slug: 'easy-dmarc',
    category: 'EasyDMARC',
    description: 'Simplified DMARC implementation and monitoring. Protect your domain from email spoofing and improve deliverability.',
    benefits: [
      'One-click DMARC setup',
      'Email spoofing protection',
      'Improved deliverability',
      'Brand protection',
      'Compliance reporting',
      'Expert support included',
    ],
    features: [
      'DMARC record generation',
      'SPF configuration',
      'DKIM setup',
      'Daily reports',
      'Threat detection',
      'Compliance dashboard',
      'Email authentication',
      'Domain monitoring',
    ],
    pricing: {
      startingFrom: '7.99',
      currency: 'USD',
      period: 'per month',
      tiers: [
        { name: 'Starter', price: '$7.99/month', features: ['1 domain', 'Daily reports', 'Basic support'] },
        { name: 'Professional', price: '$19.99/month', features: ['5 domains', 'Advanced reports', 'Priority support'] },
        { name: 'Enterprise', price: '$49.99/month', features: ['Unlimited domains', 'Custom reports', 'Dedicated support'] },
      ],
    },
    cta: {
      primary: 'Start Free Trial',
      secondary: 'View Pricing',
      url: '/products/easy-dmarc',
    },
    icon: 'shield-check',
    new: true,
  },
]

// ===== LICENSES =====
export const licenseProducts: Product[] = [
  {
    id: 'plesk-licenses',
    name: 'Plesk Licenses',
    slug: 'plesk-licenses',
    category: 'Licenses',
    description: 'Official Plesk control panel licenses for web hosting. Streamline server management with the industry-leading control panel.',
    benefits: [
      'Official Plesk licenses',
      'Instant activation',
      'All editions available',
      'Volume discounts',
      'Technical support',
      'Automatic updates',
    ],
    features: [
      'Web Admin Edition',
      'Web Pro Edition',
      'Web Host Edition',
      'VPS licenses',
      'Dedicated server licenses',
      'Extension licenses',
      'Migration support',
      '24/7 support',
    ],
    pricing: {
      startingFrom: '6.99',
      currency: 'USD',
      period: 'per month',
      tiers: [
        { name: 'Web Admin', price: '$6.99/month', features: ['10 domains', 'WordPress toolkit', 'Basic support'] },
        { name: 'Web Pro', price: '$12.99/month', features: ['30 domains', 'All extensions', 'Priority support'] },
        { name: 'Web Host', price: '$24.99/month', features: ['Unlimited domains', 'Reseller tools', '24/7 support'] },
      ],
    },
    cta: {
      primary: 'Get Plesk License',
      secondary: 'Compare Editions',
      url: '/products/licenses/plesk',
    },
    icon: 'server',
    popular: true,
  },
  {
    id: 'virtuozzo-licenses',
    name: 'Virtuozzo Licenses',
    slug: 'virtuozzo-licenses',
    category: 'Licenses',
    description: 'Virtuozzo containerization and virtualization licenses. Efficient server resource utilization and management.',
    benefits: [
      'Container-based virtualization',
      'Resource optimization',
      'High density hosting',
      'Isolated environments',
      'Easy management',
      'Cost effective',
    ],
    features: [
      'Virtuozzo Containers',
      'Virtuozzo Automation',
      'Storage capacity licensing',
      'CPU licensing options',
      'Migration tools',
      'Management panel',
      'API access',
      'Support included',
    ],
    pricing: {
      startingFrom: '9.99',
      currency: 'USD',
      period: 'per month',
    },
    cta: {
      primary: 'Get Virtuozzo',
      secondary: 'Learn More',
      url: '/products/licenses/virtuozzo',
    },
    icon: 'box',
  },
]

// ===== TLDS =====
export const tldCategories = [
  {
    id: 'generic-tlds',
    name: 'Generic TLDs',
    slug: 'generic-tlds',
    description: 'Popular generic top-level domains trusted worldwide',
    extensions: ['.com', '.net', '.org', '.info', '.biz'],
    startingPrice: '$8.06',
  },
  {
    id: 'country-code-tlds',
    name: 'Country Code TLDs',
    slug: 'country-code-tlds',
    description: 'Country-specific domains for local market targeting',
    extensions: ['.uk', '.de', '.nl', '.eu', '.ca', '.au'],
    startingPrice: '$9.99',
  },
  {
    id: 'new-gtlds',
    name: 'New gTLDs',
    slug: 'new-gtlds',
    description: 'Modern extensions for specific industries and interests',
    extensions: ['.tech', '.store', '.online', '.site', '.app', '.dev'],
    startingPrice: '$4.99',
  },
  {
    id: 'premium-tlds',
    name: 'Premium TLDs',
    slug: 'premium-tlds',
    description: 'High-value extensions for tech and innovation',
    extensions: ['.io', '.ai', '.co', '.me', '.ly'],
    startingPrice: '$29.99',
  },
  {
    id: 'industry-tlds',
    name: 'Industry TLDs',
    slug: 'industry-tlds',
    description: 'Specialized extensions for specific sectors',
    extensions: ['.law', '.med', '.edu', '.gov', '.bank', '.insurance'],
    startingPrice: '$49.99',
  },
]

// ===== SERVICES =====
export const services: Service[] = [
  {
    id: 'domain-management',
    name: 'Domain Management',
    slug: 'domain-management',
    description: 'Comprehensive domain portfolio management for businesses and agencies.',
    features: [
      'Bulk domain operations',
      'Portfolio analytics',
      'Expiration monitoring',
      'Auto-renewal management',
      'Contact management',
      'DNS management',
      'Transfer management',
      'API access',
    ],
    benefits: [
      'Centralized control',
      'Time savings',
      'Cost optimization',
      'Risk reduction',
      'Scalability',
    ],
    useCases: [
      'Domain resellers',
      'Web agencies',
      'Enterprise IT',
      'Brand protection',
    ],
    cta: {
      primary: 'Get Started',
      url: '/services',
    },
  },
  {
    id: 'ssl-management',
    name: 'SSL Certificate Management',
    slug: 'ssl-management',
    description: 'Streamlined SSL certificate lifecycle management for enterprises.',
    features: [
      'Certificate inventory',
      'Expiration alerts',
      'Auto-renewal',
      'CSR generation',
      'Multi-CA support',
      'Compliance reporting',
      'API integration',
      'Team collaboration',
    ],
    benefits: [
      'No outages',
      'Compliance assurance',
      'Cost savings',
      'Centralized management',
    ],
    useCases: [
      'Enterprises',
      'E-commerce',
      'Financial services',
      'Healthcare',
    ],
    cta: {
      primary: 'Learn More',
      url: '/ssl',
    },
  },
  {
    id: 'api-integration',
    name: 'API Integration',
    slug: 'api-integration',
    description: 'Full API access for seamless integration with your systems.',
    features: [
      'RESTful API',
      'Comprehensive documentation',
      'SDK availability',
      'Webhook support',
      'Rate limiting',
      'Sandbox environment',
      'Technical support',
      'Custom integrations',
    ],
    benefits: [
      'Automation',
      'Scalability',
      'Custom workflows',
      'Real-time sync',
    ],
    useCases: [
      'Hosting providers',
      'Domain resellers',
      'SaaS platforms',
      'Custom applications',
    ],
    cta: {
      primary: 'View Documentation',
      url: '/developers',
    },
  },
  {
    id: 'white-label',
    name: 'White Label Solutions',
    slug: 'white-label',
    description: 'Resell our services under your own brand with complete white-label options.',
    features: [
      'Custom branding',
      'White-label control panel',
      'Custom nameservers',
      'Branded emails',
      'Pricing control',
      'Billing integration',
      'Customer support',
      'Marketing materials',
    ],
    benefits: [
      'Brand building',
      'Higher margins',
      'Customer retention',
      'Full control',
    ],
    useCases: [
      'Web hosting companies',
      'Domain resellers',
      'Digital agencies',
      'IT consultants',
    ],
    cta: {
      primary: 'Become a Partner',
      url: '/partners',
    },
  },
]

// ===== COMBINED EXPORT =====
export const allProducts: Product[] = [
  ...domainProducts,
  ...sslProducts,
  ...dnsProducts,
  ...emailProducts,
  ...spamExpertsProducts,
  ...easyDmarcProducts,
  ...licenseProducts,
]

export const allServices: Service[] = services

// ===== CATEGORIES =====
export const productCategories = [
  { id: 'domains', name: 'Domains', icon: 'globe', count: domainProducts.length },
  { id: 'ssl', name: 'SSL Certificates', icon: 'lock', count: sslProducts.length },
  { id: 'dns', name: 'DNS Services', icon: 'server', count: dnsProducts.length },
  { id: 'email', name: 'Email Services', icon: 'mail', count: emailProducts.length },
  { id: 'spam-experts', name: 'Spam Experts', icon: 'shield-alert', count: spamExpertsProducts.length },
  { id: 'easy-dmarc', name: 'EasyDMARC', icon: 'shield-check', count: easyDmarcProducts.length },
  { id: 'licenses', name: 'Licenses', icon: 'key', count: licenseProducts.length },
]
