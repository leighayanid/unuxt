import { vi } from 'vitest'

/**
 * Global test setup for @unuxt/web
 *
 * This file runs before all tests and sets up:
 * - Nuxt auto-imports mocking
 * - Global test utilities
 * - Environment configuration
 */

// Mock Nuxt auto-imports
// These are automatically available in Nuxt but need to be mocked in tests
global.navigateTo = vi.fn()
global.useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  go: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
}))

global.useRoute = vi.fn(() => ({
  path: '/',
  params: {},
  query: {},
  meta: {},
}))

global.useState = vi.fn((key, init) => {
  const state = ref(typeof init === 'function' ? init() : init)
  return state
})

global.useRuntimeConfig = vi.fn(() => ({
  public: {
    baseURL: 'http://localhost:3000',
  },
}))

global.useCookie = vi.fn((name) => ref(null))

global.useRequestURL = vi.fn(() => new URL('http://localhost:3000'))

global.useHead = vi.fn()
global.useSeoMeta = vi.fn()

// Mock ref and computed if not already available
if (!global.ref) {
  global.ref = vi.fn((value) => ({ value }))
}

if (!global.computed) {
  global.computed = vi.fn((getter) => ({ value: getter() }))
}

if (!global.watch) {
  global.watch = vi.fn()
}

if (!global.onMounted) {
  global.onMounted = vi.fn((fn) => fn())
}

if (!global.onUnmounted) {
  global.onUnmounted = vi.fn()
}

// Set up test environment variables
process.env.BETTER_AUTH_SECRET = 'test-secret-key'
process.env.BETTER_AUTH_URL = 'http://localhost:3000'
