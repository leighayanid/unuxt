import { test, expect } from '@playwright/test'

test.describe('Authentication', () => {
  test.describe('Login page', () => {
    test('should display login form', async ({ page }) => {
      await page.goto('/auth/login')

      // Check for email input
      const emailInput = page.locator('input[type="email"]')
      await expect(emailInput).toBeVisible()

      // Check for password input
      const passwordInput = page.locator('input[type="password"]')
      await expect(passwordInput).toBeVisible()

      // Check for submit button
      const submitButton = page.locator('button[type="submit"]')
      await expect(submitButton).toBeVisible()
    })

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login')

      // Fill in invalid credentials
      await page.fill('input[type="email"]', 'invalid@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')

      // Submit form
      await page.click('button[type="submit"]')

      // Wait for error message
      // Note: Adjust selector based on actual error display
      await expect(page.locator('text=/invalid|error|wrong/i')).toBeVisible({
        timeout: 5000,
      })
    })

    test('should have link to register page', async ({ page }) => {
      await page.goto('/auth/login')

      const registerLink = page.locator('a[href*="/auth/register"]')
      await expect(registerLink).toBeVisible()
    })

    test('should have forgot password link', async ({ page }) => {
      await page.goto('/auth/login')

      const forgotLink = page.locator('a[href*="/auth/forgot-password"]')
      await expect(forgotLink).toBeVisible()
    })
  })

  test.describe('Register page', () => {
    test('should display registration form', async ({ page }) => {
      await page.goto('/auth/register')

      // Check for name input
      await expect(page.locator('input[name="name"]')).toBeVisible()

      // Check for email input
      await expect(page.locator('input[type="email"]')).toBeVisible()

      // Check for password input
      await expect(page.locator('input[type="password"]')).toBeVisible()

      // Check for submit button
      await expect(page.locator('button[type="submit"]')).toBeVisible()
    })

    test('should validate password requirements', async ({ page }) => {
      await page.goto('/auth/register')

      // Fill in form with weak password
      await page.fill('input[name="name"]', 'Test User')
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'weak')

      // Submit form
      await page.click('button[type="submit"]')

      // Should show password validation error
      await expect(page.locator('text=/password.*8.*characters/i')).toBeVisible({
        timeout: 3000,
      })
    })

    test('should have link to login page', async ({ page }) => {
      await page.goto('/auth/register')

      const loginLink = page.locator('a[href*="/auth/login"]')
      await expect(loginLink).toBeVisible()
    })
  })

  test.describe('Protected routes', () => {
    test('should redirect to login when not authenticated', async ({ page }) => {
      await page.goto('/dashboard')

      // Should be redirected to login
      await expect(page).toHaveURL(/\/auth\/login/)
    })

    test('should redirect to login for admin routes', async ({ page }) => {
      await page.goto('/admin')

      // Should be redirected to login
      await expect(page).toHaveURL(/\/auth\/login/)
    })
  })

  test.describe('OAuth providers', () => {
    test('should display Google sign-in button', async ({ page }) => {
      await page.goto('/auth/login')

      const googleButton = page.locator('button:has-text("Google")')
      await expect(googleButton).toBeVisible()
    })

    test('should display GitHub sign-in button', async ({ page }) => {
      await page.goto('/auth/login')

      const githubButton = page.locator('button:has-text("GitHub")')
      await expect(githubButton).toBeVisible()
    })
  })
})
