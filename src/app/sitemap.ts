import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://buildwithai.digital').replace(/\/$/, '')
  const now = new Date()

  const routes = ['/', '/ssl', '/services/ai-design', '/products/templates']

  return routes.map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.8,
  }))
}
