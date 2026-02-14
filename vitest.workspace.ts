import { defineWorkspace } from 'vitest/config'

/**
 * Vitest workspace configuration for Unuxt monorepo
 *
 * This workspace file automatically discovers all vitest.config.ts files
 * across packages and apps, enabling parallel test execution and shared
 * configuration management.
 *
 * Run tests across the entire workspace:
 * - pnpm test                  # Run all tests
 * - pnpm test:watch            # Watch mode
 * - pnpm test:ui               # Interactive UI
 * - pnpm test:coverage         # Coverage report
 *
 * Run tests for specific package:
 * - pnpm --filter @unuxt/utils test
 */
export default defineWorkspace([
  // Packages
  'packages/utils',
  'packages/db',
  'packages/auth',
  'packages/email',
  'packages/types',
  'packages/config',
  'packages/ui',

  // Apps
  'apps/web',
  'apps/docs',
])
