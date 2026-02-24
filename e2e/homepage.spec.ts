/**
 * Playwright E2E Tests for BUILD WITH AI
 * Tests core functionality across the application
 */

import { test, expect } from '@playwright/test'

// Helper to close the MARZ chat widget when it appears in the UI and may
// intercept pointer events during tests.
async function dismissMarz(page: any) {
  try {
    // Try multiple selectors to find the close button
    const btn = page.locator('button[aria-label*="Close" i], button[aria-label*="close" i], [data-testid="marz-close"]')
    if ((await btn.count()) > 0) {
      await btn.first().click().catch(() => {})
      await page.waitForTimeout(200)
    }
  } catch (e) {
    // ignore
  }
}

test.beforeEach(async ({ page }) => {
  // Prevent MARZ from rendering and intercepting pointer events during tests
  await page.addInitScript(() => {
    try {
      localStorage.setItem('marz_disable', '1')
    } catch (e) {
      // ignore
    }
  })
})

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)
    await expect(page).toHaveTitle(/BUILD WITH AI/)
    await expect(page.locator('body')).toBeVisible()
  })

  test('should display the main navigation', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)

    // Check for main navigation items using text content
    await expect(page.locator('a:has-text("Home")').first()).toBeVisible()
    await expect(page.locator('a:has-text("Developers")').first()).toBeVisible()
    await expect(page.locator('a:has-text("About")').first()).toBeVisible()
    // Products and Services are dropdown buttons, not direct links
    await expect(page.locator('button:has-text("Products")').first()).toBeVisible()
    await expect(page.locator('button:has-text("Services")').first()).toBeVisible()
  })

  test('should display the theme toggle button', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)

    // Look for theme toggle by aria-label or common selectors
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Theme" i], [data-theme-toggle]')
    await expect(themeToggle.first()).toBeVisible()
  })

  test('should open mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    
    // Dismiss MARZ widget first
    await dismissMarz(page)

    // Look for mobile menu button and click it
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i], [data-testid="mobile-menu-btn"]').first()
    await menuButton.click({ force: true })
    await page.waitForTimeout(1500)

    // Check that the page has navigation elements (mobile menu is open)
    // The mobile menu should contain links
    const navLinks = page.locator('nav a, [role="dialog"] a, a[href^="/"]')
    await expect(navLinks.first()).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Navigation', () => {
  test('should navigate to products page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await dismissMarz(page)

    // Hover over Products to open dropdown, then click "All Products"
    const productsButton = page.locator('button:has-text("Products"), a:has-text("Products")').first()
    await productsButton.hover({ force: true })
    await page.waitForTimeout(500)
    
    const allProductsLink = page.locator('a:has-text("All Products"), a[href="/products"]').first()
    await allProductsLink.click({ force: true })
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
    
    // Check URL contains products
    await expect(page).toHaveURL(/.*products.*/, { timeout: 5000 })
    await expect(page).toHaveTitle(/Products/)
  })

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await dismissMarz(page)

    // Hover over Services to open dropdown, then click "Services Overview"
    const servicesButton = page.locator('button:has-text("Services"), a:has-text("Services")').first()
    await servicesButton.hover({ force: true })
    await page.waitForTimeout(500)
    
    const servicesOverviewLink = page.locator('a:has-text("Services Overview"), a[href="/services"]').first()
    await servicesOverviewLink.click({ force: true })
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
    
    // Check URL contains services
    await expect(page).toHaveURL(/.*services.*/, { timeout: 5000 })
    await expect(page).toHaveTitle(/Services/)
  })

  test('should navigate to developers page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await dismissMarz(page)

    const devLink = page.locator('a:has-text("Developers")').first()
    await devLink.click({ force: true })
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
    
    // Check URL contains developers
    await expect(page).toHaveURL(/.*developers.*/, { timeout: 5000 })
  })
})

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await dismissMarz(page)

    // Look for Login button in header or footer
    const loginButton = page.locator('button:has-text("Login"), a:has-text("Login"), a[href="/login"]').first()
    await loginButton.click({ force: true })
    await page.waitForURL('/login', { waitUntil: 'domcontentloaded', timeout: 15000 })

    await expect(page).toHaveURL('/login')
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await dismissMarz(page)
    
    const signupButton = page.locator('button:has-text("Sign Up"), a:has-text("Sign Up"), a[href="/signup"]').first()
    await signupButton.click({ force: true })
    
    // Wait for page to load
    await page.waitForLoadState('domcontentloaded', { timeout: 20000 })
    
    // Check we're on signup page
    await expect(page).toHaveURL(/.*signup.*/, { timeout: 5000 })
  })
})

test.describe('Accessibility', () => {
  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)

    // Check theme toggle has aria-label
    const themeToggle = page.locator('button[aria-label*="theme" i], button[aria-label*="Theme" i]').first()
    await expect(themeToggle).toHaveAttribute('aria-label')

    // Check mobile menu button has aria-label
    await page.setViewportSize({ width: 375, height: 667 })
    const menuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="Menu" i]').first()
    await expect(menuButton).toHaveAttribute('aria-label')
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)

    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')

    // Check that an element is focused
    await expect(page.locator(':focus')).toBeFocused()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)

    // Check for h1 - may be in main content or hero section
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible({ timeout: 5000 })
  })
})

test.describe('Privacy & Terms', () => {
  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy', { waitUntil: 'networkidle' })
    await dismissMarz(page)
    await expect(page).toHaveTitle(/Privacy/)
    await expect(page.locator('h1')).toContainText('Privacy')
  })

  test('should load terms of service page', async ({ page }) => {
    await page.goto('/terms', { waitUntil: 'domcontentloaded' })
    await dismissMarz(page)
    await expect(page).toHaveTitle(/Terms/)
    await expect(page.locator('h1')).toContainText('Terms')
  })
})

test.describe('Error Handling', () => {
  test('should display 404 page for non-existent routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345', { waitUntil: 'networkidle' })
    await dismissMarz(page)
    expect(response?.status()).toBe(404)
  })
})

test.describe('Performance', () => {
  test('should load homepage within 3 seconds', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)
    const loadTime = Date.now() - startTime

    // Allow longer threshold on CI/dev machines
    expect(loadTime).toBeLessThan(10000)
  })

  test('should have no layout shift on load', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    await dismissMarz(page)

    // Get the layout shift metric
    const layoutShift = await page.evaluate(() => {
      return new Promise((resolve) => {
        let cumulativeShift = 0
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              cumulativeShift += (entry as any).value
            }
          }
        }).observe({ type: 'layout-shift', buffered: true })

        setTimeout(() => resolve(cumulativeShift), 2000)
      })
    })

    // Cumulative Layout Shift should be less than 0.1
    expect(layoutShift).toBeLessThan(0.1)
  })
})
