# Testing Guide

This document provides comprehensive guidance on testing in the Unuxt monorepo.

## Table of Contents

- [Overview](#overview)
- [Testing Stack](#testing-stack)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Test Organization](#test-organization)
- [Best Practices](#best-practices)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Overview

Unuxt uses a comprehensive testing strategy that includes:

- **Unit Tests**: Testing individual functions, utilities, and schemas
- **Component Tests**: Testing Vue components in isolation
- **Integration Tests**: Testing composables and API routes with mocked dependencies
- **E2E Tests**: Testing complete user flows using Playwright

## Testing Stack

### Core Testing Tools

- **[Vitest](https://vitest.dev/)** - Fast, ESM-native unit testing framework
  - Drop-in replacement for Jest with better ESM support
  - Built-in TypeScript support
  - Watch mode, UI, and coverage out of the box

- **[@vue/test-utils](https://test-utils.vuejs.org/)** - Official Vue component testing library
  - Mount components in isolation
  - Trigger user interactions
  - Assert on rendered output

- **[@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing)** - Nuxt-specific testing utilities
  - Mock Nuxt auto-imports
  - Test Nuxt composables
  - Test server routes

- **[happy-dom](https://github.com/capricorn86/happy-dom)** - Lightweight DOM implementation
  - Faster than jsdom
  - Better ESM support
  - Less memory usage

- **[Playwright](https://playwright.dev/)** - Cross-browser E2E testing
  - Chromium, Firefox, WebKit support
  - Automatic waiting
  - Network interception
  - Screenshots and videos

### Coverage Tools

- **[@vitest/coverage-v8](https://vitest.dev/guide/coverage)** - Code coverage using V8
  - Fast native coverage
  - Multiple output formats (text, json, html)
  - Coverage thresholds per package

## Running Tests

### All Tests

```bash
# Run all tests in the monorepo
pnpm test

# Watch mode for all tests
pnpm test:watch

# Interactive UI for all tests
pnpm test:ui

# Generate coverage reports
pnpm test:coverage
```

### Package-Specific Tests

```bash
# Test specific package
pnpm --filter @unuxt/utils test
pnpm --filter @unuxt/db test
pnpm --filter @unuxt/auth test

# Test apps
pnpm --filter @unuxt/web test
pnpm --filter @unuxt/docs test

# Package tests in watch mode
pnpm --filter @unuxt/utils test:watch
```

### E2E Tests

```bash
# Run E2E tests (requires dev server)
pnpm --filter @unuxt/web test:e2e

# Run with UI for debugging
pnpm --filter @unuxt/web test:e2e:ui

# Run in headed mode (see browser)
pnpm --filter @unuxt/web test:e2e:headed

# Debug mode (step through tests)
pnpm --filter @unuxt/web test:e2e:debug
```

### Environment Setup

Before running tests that require a database:

```bash
# Copy test environment template
cp .env.test .env

# Update with your local database URL
# Edit DATABASE_URL in .env

# Run database migrations
pnpm db:push
```

## Writing Tests

### Unit Tests

Test pure functions and utilities:

```typescript
// packages/utils/src/formatters.test.ts
import { describe, it, expect } from 'vitest'
import { formatDate } from './formatters'

describe('formatDate', () => {
  it('should format date correctly', () => {
    const date = new Date('2024-03-15T10:30:00Z')
    const result = formatDate(date)

    expect(result).toMatch(/Mar 1[45], 2024/)
  })
})
```

### Schema Tests

Test database schemas:

```typescript
// packages/db/src/schema/users.test.ts
import { describe, it, expect } from 'vitest'
import { users } from './users'
import { getTableColumns } from 'drizzle-orm'

describe('users schema', () => {
  it('should have correct columns', () => {
    const columns = getTableColumns(users)

    expect(columns).toHaveProperty('id')
    expect(columns).toHaveProperty('email')
    expect(columns.email.notNull).toBe(true)
  })
})
```

### Composable Tests

Test Nuxt composables with mocked dependencies:

```typescript
// apps/web/app/composables/useAuth.test.ts
import { describe, it, expect, vi } from 'vitest'
import { useAuth } from './useAuth'

// Mock Nuxt app
global.useNuxtApp = vi.fn(() => ({
  $authClient: mockAuthClient,
}))

describe('useAuth', () => {
  it('should login with email and password', async () => {
    const { login } = useAuth()
    const result = await login('test@example.com', 'password')

    expect(mockAuthClient.signIn.email).toHaveBeenCalled()
  })
})
```

### Component Tests

Test Vue components:

```typescript
// apps/web/app/components/theme/ThemeToggle.test.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ThemeToggle from './ThemeToggle.vue'

describe('ThemeToggle', () => {
  it('should toggle theme on click', async () => {
    const wrapper = mount(ThemeToggle)

    await wrapper.find('button').trigger('click')

    expect(mockToggleColorMode).toHaveBeenCalled()
  })
})
```

### API Route Tests

Test Nitro event handlers:

```typescript
// apps/web/server/api/health.test.ts
import { describe, it, expect } from 'vitest'
import handler from './health.get'

describe('GET /api/health', () => {
  it('should return status ok', async () => {
    const result = await handler()

    expect(result).toHaveProperty('status', 'ok')
    expect(result).toHaveProperty('timestamp')
  })
})
```

### E2E Tests

Test complete user flows:

```typescript
// apps/web/tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('should display login form', async ({ page }) => {
  await page.goto('/auth/login')

  await expect(page.locator('input[type="email"]')).toBeVisible()
  await expect(page.locator('input[type="password"]')).toBeVisible()
})
```

## Test Organization

Tests are **colocated** with source files for better discoverability:

```
packages/utils/
  src/
    validation.ts
    validation.test.ts     ✅ Test next to source
    formatters.ts
    formatters.test.ts     ✅ Test next to source

apps/web/
  app/
    composables/
      useAuth.ts
      useAuth.test.ts      ✅ Test next to source
    components/
      ThemeToggle.vue
      ThemeToggle.test.ts  ✅ Test next to source
  server/
    api/
      health.get.ts
      health.test.ts       ✅ Test next to source
  tests/
    setup.ts               ✅ Global test setup
    e2e/
      auth.spec.ts         ✅ E2E tests separate
      health.spec.ts
```

## Best Practices

### 1. Test Naming

Use descriptive test names that explain **what** is being tested and **why**:

```typescript
// ❌ Bad
it('works', () => { ... })

// ✅ Good
it('should return error when email is invalid', () => { ... })
```

### 2. AAA Pattern

Follow the Arrange-Act-Assert pattern:

```typescript
it('should format bytes correctly', () => {
  // Arrange
  const bytes = 1024

  // Act
  const result = formatBytes(bytes)

  // Assert
  expect(result).toBe('1 KB')
})
```

### 3. Test One Thing

Each test should verify one specific behavior:

```typescript
// ❌ Bad - testing multiple things
it('should handle user data', () => {
  expect(user.name).toBe('John')
  expect(user.email).toBe('john@example.com')
  expect(user.isActive).toBe(true)
})

// ✅ Good - separate tests
it('should have correct name', () => {
  expect(user.name).toBe('John')
})

it('should have correct email', () => {
  expect(user.email).toBe('john@example.com')
})
```

### 4. Mock External Dependencies

Always mock external services and databases in unit tests:

```typescript
// Mock database
vi.mock('@unuxt/db', () => ({
  db: {
    query: { users: { findFirst: vi.fn() } }
  }
}))

// Mock auth
vi.mock('@unuxt/auth/server', () => ({
  auth: { api: { getSession: vi.fn() } }
}))
```

### 5. Use Factories for Test Data

Create reusable test data factories:

```typescript
// test/factories/user.ts
export function createTestUser(overrides = {}) {
  return {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    ...overrides,
  }
}

// Usage
const user = createTestUser({ email: 'custom@example.com' })
```

### 6. Clean Up After Tests

Always reset mocks and clean up state:

```typescript
import { beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  vi.restoreAllMocks()
})
```

### 7. Test Edge Cases

Don't just test the happy path:

```typescript
describe('slugify', () => {
  it('should convert to lowercase', () => { ... })
  it('should handle empty strings', () => { ... })
  it('should handle special characters', () => { ... })
  it('should trim whitespace', () => { ... })
})
```

## Coverage Thresholds

Different packages have different coverage targets based on complexity:

| Package Type | Lines | Functions | Branches | Statements |
|-------------|-------|-----------|----------|------------|
| **@unuxt/utils** | 90% | 90% | 85% | 90% |
| **@unuxt/db** | 70% | 70% | 60% | 70% |
| **@unuxt/auth** | 50% | 50% | 40% | 50% |
| **@unuxt/ui** | 60% | 60% | 55% | 60% |
| **apps/web** | 60% | 60% | 50% | 60% |

View coverage reports:

```bash
# Generate HTML coverage report
pnpm test:coverage

# Open in browser
open coverage/index.html
```

## CI/CD Integration

Tests run automatically on every push and pull request:

### GitHub Actions Workflow

1. **Lint & Type Check** - Runs first to catch syntax errors
2. **Unit Tests** - Runs all package and app tests
   - PostgreSQL service container
   - Coverage report generation
   - Upload to Codecov
3. **E2E Tests** - Runs Playwright tests
   - Installs Playwright browsers
   - Runs against local dev server
   - Uploads test reports
4. **Build** - Only runs if tests pass

### Local CI Simulation

Run the same checks locally before pushing:

```bash
# Run all checks in order
pnpm lint && pnpm typecheck && pnpm test && pnpm build
```

## Troubleshooting

### Tests Failing Locally

**Database connection errors:**

```bash
# Ensure PostgreSQL is running
pg_isready

# Check DATABASE_URL in .env
echo $DATABASE_URL

# Run migrations
pnpm db:push
```

**Module resolution errors:**

```bash
# Clear Nuxt cache
rm -rf apps/web/.nuxt

# Reinstall dependencies
pnpm install
```

**Mock errors:**

```typescript
// Ensure mocks are defined before imports
vi.mock('@unuxt/db', () => ({ ... }))

// Then import
import handler from './api/route'
```

### E2E Tests Timing Out

```bash
# Increase timeout in playwright.config.ts
timeout: 60 * 1000  // 60 seconds

# Run dev server manually first
pnpm dev

# Then run E2E in another terminal
pnpm test:e2e
```

### Coverage Not Updating

```bash
# Clear coverage directory
rm -rf coverage

# Run with --coverage flag
pnpm test:coverage
```

### Vitest UI Not Loading

```bash
# Ensure port 51204 (default) is not in use
lsof -i :51204

# Or specify custom port
pnpm test:ui --port 3333
```

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Playwright Documentation](https://playwright.dev/)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Nuxt Testing Guide](https://nuxt.com/docs/getting-started/testing)

## Getting Help

- Check existing tests for examples
- Read test error messages carefully
- Use `test.only()` to isolate failing tests
- Use `console.log()` for debugging (remove before commit)
- Ask for help in team chat with error details

---

**Remember**: Good tests give you confidence to refactor and ship faster. Write tests that you'd want to debug at 2am. 🚀
