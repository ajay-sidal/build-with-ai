#!/usr/bin/env tsx
/**
 * Link Verification Script
 * Scans all pages on buildwithai.digital and verifies they return 200 status
 */

import https from 'https';
import http from 'http';

const BASE_URL = 'https://www.buildwithai.digital';

// All static and dynamic routes from the build output
const PAGES = [
  // Core pages
  '/',
  '/about',
  '/affiliate',
  '/dashboard',
  '/dashboard/mission-control',
  '/dashboard/api',
  '/dashboard/billing',
  '/dashboard/infrastructure',
  '/developers',
  '/login',
  '/signup',
  '/membership',
  '/partners',
  '/partners/dashboard',
  '/privacy',
  '/terms',
  
  // Products
  '/products',
  '/products/dns/hosting',
  '/products/dns/nameservers',
  '/products/dns/templates',
  '/products/domains/registration',
  '/products/domains/renewal',
  '/products/domains/transfer',
  '/products/easy-dmarc',
  '/products/email/templates',
  '/products/email/verification',
  '/products/licenses/plesk',
  '/products/licenses/virtuozzo',
  '/products/premium-dns',
  '/products/spam-experts',
  '/products/spam-experts/archiving',
  '/products/spam-experts/incoming',
  '/products/spam-experts/outgoing',
  '/products/ssl',
  '/products/ssl/code-signing',
  '/products/ssl/domain-validation',
  '/products/ssl/email-signing',
  '/products/ssl/extended-validation',
  '/products/ssl/multi-domain',
  '/products/ssl/organization-validation',
  '/products/ssl/wildcard',
  '/products/templates',
  '/products/tlds',
  
  // Services
  '/services',
  '/services/ai-design',
  '/services/customer-management',
  '/services/domain-management',
  '/services/ssl-management',
  
  // SSL
  '/ssl',
  
  // Tools
  '/tools/ai-generator',
  
  // Hero Demo
  '/hero-demo',
  
  // Leads
  '/leads',
  
  // Checkout
  '/checkout/cancel',
  
  // Admin (may require auth, but should not 404)
  '/admin/dashboard',
  '/admin/leads',
  '/admin/payouts',
  '/admin/errors',
  
  // SEO files
  '/robots.txt',
  '/sitemap.xml',
];

interface Result {
  url: string;
  status: number;
  ok: boolean;
  error?: string;
}

function checkUrl(url: string): Promise<Result> {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http;
    
    const req = client.get(url, { timeout: 10000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          url,
          status: res.statusCode || 0,
          ok: (res.statusCode || 0) === 200,
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        status: 0,
        ok: false,
        error: error.message,
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        status: 0,
        ok: false,
        error: 'Request timeout',
      });
    });
  });
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║   BUILD WITH AI - Link Verification Scanner           ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Total pages to check: ${PAGES.length}`);
  console.log('');
  
  const results: Result[] = [];
  const failed: Result[] = [];
  const success: Result[] = [];
  
  for (const page of PAGES) {
    const url = `${BASE_URL}${page}`;
    process.stdout.write(`  Checking: ${page}... `);
    
    const result = await checkUrl(url);
    results.push(result);
    
    if (result.ok) {
      console.log('✅ OK');
      success.push(result);
    } else if (result.status === 404) {
      console.log('❌ 404 NOT FOUND');
      failed.push(result);
    } else if (result.status >= 300 && result.status < 400) {
      console.log(`⚠️  Redirect (${result.status})`);
      success.push(result); // Redirects are OK
    } else {
      console.log(`❌ Error (${result.status || 'N/A'}): ${result.error || 'Unknown'}`);
      failed.push(result);
    }
  }
  
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('SUMMARY');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`Total pages: ${results.length}`);
  console.log(`✅ Success: ${success.length} (${Math.round((success.length / results.length) * 100)}%)`);
  console.log(`❌ Failed: ${failed.length} (${Math.round((failed.length / results.length) * 100)}%)`);
  console.log('');
  
  if (failed.length > 0) {
    console.log('FAILED PAGES:');
    console.log('───────────────────────────────────────────────────────');
    for (const result of failed) {
      console.log(`  ❌ ${result.url} - Status: ${result.status || 'N/A'} ${result.error ? `- ${result.error}` : ''}`);
    }
    console.log('');
    process.exit(1);
  } else {
    console.log('🎉 All pages are working correctly!');
    console.log('');
    process.exit(0);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
