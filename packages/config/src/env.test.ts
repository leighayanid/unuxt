import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { validateEnv, checkEnv, featureFlags } from './env'

describe('Environment Validation', () => {
  const originalEnv = process.env

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('validateEnv', () => {
    it('should pass with valid required environment variables', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db'
      process.env.BETTER_AUTH_SECRET = 'a'.repeat(32)
      process.env.BETTER_AUTH_URL = 'http://localhost:3000'

      expect(() => validateEnv()).not.toThrow()
    })

    it('should fail with invalid DATABASE_URL', () => {
      process.env.DATABASE_URL = 'invalid-url'
      process.env.BETTER_AUTH_SECRET = 'a'.repeat(32)
      process.env.BETTER_AUTH_URL = 'http://localhost:3000'

      expect(() => validateEnv()).toThrow()
    })

    it('should fail with short BETTER_AUTH_SECRET', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db'
      process.env.BETTER_AUTH_SECRET = 'too-short'
      process.env.BETTER_AUTH_URL = 'http://localhost:3000'

      expect(() => validateEnv()).toThrow()
    })
  })

  describe('checkEnv', () => {
    it('should return success for valid environment', () => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db'
      process.env.BETTER_AUTH_SECRET = 'a'.repeat(32)
      process.env.BETTER_AUTH_URL = 'http://localhost:3000'

      const result = checkEnv()
      expect(result.success).toBe(true)
      expect(result.errors).toBeUndefined()
    })

    it('should return errors for invalid environment', () => {
      process.env.DATABASE_URL = 'invalid'
      process.env.BETTER_AUTH_SECRET = 'short'
      process.env.BETTER_AUTH_URL = 'not-a-url'

      const result = checkEnv()
      expect(result.success).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })
  })

  describe('featureFlags', () => {
    beforeEach(() => {
      process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/db'
      process.env.BETTER_AUTH_SECRET = 'a'.repeat(32)
      process.env.BETTER_AUTH_URL = 'http://localhost:3000'
    })

    it('should detect Google OAuth when configured', () => {
      process.env.GOOGLE_CLIENT_ID = 'test-id'
      process.env.GOOGLE_CLIENT_SECRET = 'test-secret'

      expect(featureFlags.hasGoogleOAuth()).toBe(true)
    })

    it('should return false when Google OAuth not configured', () => {
      delete process.env.GOOGLE_CLIENT_ID
      delete process.env.GOOGLE_CLIENT_SECRET

      expect(featureFlags.hasGoogleOAuth()).toBe(false)
    })

    it('should detect email config when all SMTP vars present', () => {
      process.env.SMTP_HOST = 'smtp.example.com'
      process.env.SMTP_PORT = '587'
      process.env.SMTP_USER = 'user@example.com'
      process.env.SMTP_PASS = 'password'
      process.env.FROM_EMAIL = 'noreply@example.com'

      expect(featureFlags.hasEmailConfig()).toBe(true)
    })

    it('should return false when email config incomplete', () => {
      process.env.SMTP_HOST = 'smtp.example.com'
      // Missing other SMTP vars

      expect(featureFlags.hasEmailConfig()).toBe(false)
    })

    it('should detect NODE_ENV correctly', () => {
      process.env.NODE_ENV = 'production'
      expect(featureFlags.isProduction()).toBe(true)
      expect(featureFlags.isDevelopment()).toBe(false)

      process.env.NODE_ENV = 'development'
      expect(featureFlags.isProduction()).toBe(false)
      expect(featureFlags.isDevelopment()).toBe(true)

      process.env.NODE_ENV = 'test'
      expect(featureFlags.isTest()).toBe(true)
    })
  })
})
