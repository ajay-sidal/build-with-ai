import { test, expect } from '@playwright/test'

// This test navigates the app in headed mode and captures any network
// responses to /api/auth/* that have 5xx status so we can reproduce server
// errors seen by clients.

test('capture next-auth 5xx responses', async ({ page }) => {
  const errors: Array<{ url: string; status: number; text: string }> = []

  page.on('response', async (response) => {
    try {
      const url = response.url()
      if (url.includes('/api/auth/')) {
        const status = response.status()
        if (status >= 500) {
          let text = ''
          try { text = await response.text() } catch (e) { text = String(e) }
          errors.push({ url, status, text })
        }
      }
    } catch (e) {
      // ignore
    }
  })

  // Visit home and then the login page to trigger auth flows
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(1000)
  // Navigate to login page
  await page.goto('/login', { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForTimeout(2000)

  if (errors.length > 0) {
    console.log('Captured NextAuth 5xx responses:')
    for (const e of errors) console.log(e)
  }

  // Skip assertion in development - only fail in CI
  if (process.env.CI) {
    expect(errors.length).toBe(0)
  }
})
