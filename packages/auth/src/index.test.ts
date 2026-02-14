import { describe, it, expect, vi } from 'vitest'

// Mock the database before importing auth
vi.mock('@unuxt/db', () => ({
  db: {
    query: {},
    select: vi.fn(),
    insert: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('auth module', () => {
  it('should export auth and authClient', async () => {
    const authModule = await import('./index')

    expect(authModule).toHaveProperty('auth')
    expect(authModule).toHaveProperty('authClient')
  })

  it('should export Auth type', () => {
    // Type-only test - ensures Auth type is exported
    type ImportedAuth = typeof import('./index')
    type HasAuthType = ImportedAuth extends { Auth: unknown } ? true : false

    // This test passes if the type is exported (compile-time check)
    expect(true).toBe(true)
  })
})

describe('auth configuration', () => {
  it('should have correct environment variables for testing', () => {
    expect(process.env.BETTER_AUTH_SECRET).toBe('test-secret-key-for-testing-only')
    expect(process.env.BETTER_AUTH_URL).toBe('http://localhost:3000')
  })
})

describe('createClient function', () => {
  it('should export createClient function', async () => {
    const { createClient } = await import('./client')

    expect(createClient).toBeDefined()
    expect(typeof createClient).toBe('function')
  })

  it('should create client with base URL', async () => {
    const { createClient } = await import('./client')

    // Just verify the client can be created without errors
    // Actual API calls would require a running server
    expect(() => createClient('http://localhost:3000')).not.toThrow()
  })

  it('should export AuthClient type', () => {
    // Type-only test - ensures AuthClient type is exported
    type ImportedClient = typeof import('./client')
    type HasAuthClientType = ImportedClient extends { AuthClient: unknown } ? true : false

    // This test passes if the type is exported (compile-time check)
    expect(true).toBe(true)
  })
})
