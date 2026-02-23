/**
 * Playwright E2E Tests for BUILD WITH AI
 * Tests core functionality across the application
 */

import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/BUILD WITH AI/)
  })

  test('should display the main navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for main navigation items
    await expect(page.getByRole('link', { name: 'Home' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Developers' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Services' })).toBeVisible()
  })

  test('should display the theme toggle button', async ({ page }) => {
    await page.goto('/')
    
    const themeToggle = page.getByRole('button', { name: /switch to (dark|light) theme/i })
    await expect(themeToggle).toBeVisible()
  })

  test('should open mobile menu on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    const menuButton = page.getByRole('button', { name: /open menu/i })
    await expect(menuButton).toBeVisible()
    await menuButton.click()
    
    // Check that mobile menu is visible
    await expect(page.getByRole('link', { name: 'Home' }).first()).toBeVisible()
  })
})

test.describe('Navigation', () => {
  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('link', { name: 'Products' }).hover()
    await page.getByRole('link', { name: 'All Products' }).click()
    
    await expect(page).toHaveURL('/products')
    await expect(page).toHaveTitle(/Products/)
  })

  test('should navigate to services page', async ({ page }) => {
    await page.goto('/')
    
    await page.getByRole('link', { name: 'Services' }).hover()
    await page.getByRole('link', { name: 'Services Overview' }).click()
    
    await expect(page).toHaveURL('/services')
    await expect(page).toHaveTitle(/Services/)
  })

  test('should navigate to developers page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Developers' }).click()
    
    await expect(page).toHaveURL('/developers')
  })
})

test.describe('Authentication', () => {
  test('should navigate to login page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Login' }).click()
    
    await expect(page).toHaveURL('/login')
  })

  test('should navigate to signup page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Sign Up' }).click()
    
    await expect(page).toHaveURL('/signup')
  })
})

test.describe('Accessibility', () => {
  test('should have proper ARIA labels on interactive elements', async ({ page }) => {
    await page.goto('/')
    
    // Check theme toggle has aria-label
    const themeToggle = page.getByRole('button', { name: /switch to (dark|light) theme/i })
    await expect(themeToggle).toHaveAttribute('aria-label')
    
    // Check mobile menu button has aria-label
    await page.setViewportSize({ width: 375, height: 667 })
    const menuButton = page.getByRole('button', { name: /open menu/i })
    await expect(menuButton).toHaveAttribute('aria-label')
  })

  test('should be keyboard navigable', async ({ page }) => {
    await page.goto('/')
    
    // Tab through interactive elements
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    
    // Check that an element is focused
    const focusedElement = page.locator(':focus')
    await expect(focusedElement).toBeFocused()
  })

  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/')
    
    // Check for h1
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
  })
})

test.describe('Privacy & Terms', () => {
  test('should load privacy policy page', async ({ page }) => {
    await page.goto('/privacy')
    await expect(page).toHaveTitle(/Privacy Policy/)
    await expect(page.locator('h1')).toContainText('Privacy Policy')
  })

  test('should load terms of service page', async ({ page }) => {
    await page.goto('/terms')
    await expect(page).toHaveTitle(/Terms of Service/)
    await expect(page.locator('h1')).toContainText('Terms of Service')
  })
})

test.describe('Error Handling', () => {
  test('should display 404 page for non-existent routes', async ({ page }) => {
    const response = await page.goto('/non-existent-page-12345')
    expect(response?.status()).toBe(404)
  })
})

test.describe('Performance', () => {
  test('should load homepage within 3 seconds', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    const loadTime = Date.now() - startTime
    
    expect(loadTime).toBeLessThan(3000)
  })

  test('should have no layout shift on load', async ({ page }) => {
    await page.goto('/')
    
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
