import { defineConfig, mergeConfig, type UserConfig } from 'vitest/config'
import { resolve } from 'node:path'

/**
 * Shared Vitest configuration utilities for Unuxt monorepo
 *
 * Provides consistent test setup across all packages and apps:
 * - Standard coverage thresholds
 * - Consistent test environment settings
 * - Shared reporter configuration
 */

/**
 * Base Vitest configuration for all packages
 * Use this as the foundation for package-specific configs
 */
export const baseConfig: UserConfig = {
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.nuxt/**',
        '**/.output/**',
        '**/coverage/**',
        '**/*.config.{ts,js,mjs,cjs}',
        '**/*.d.ts',
        '**/test/**',
        '**/__tests__/**',
        '**/*.test.{ts,js}',
        '**/*.spec.{ts,js}',
      ],
    },
    include: ['**/*.test.ts', '**/*.spec.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.nuxt/**',
      '**/.output/**',
      '**/coverage/**',
    ],
  },
}

/**
 * Package-specific configuration creator
 * @param packageName - Name of the package (for display purposes)
 * @param options - Additional Vitest config options to merge
 */
export function definePackageConfig(
  packageName: string,
  options: UserConfig = {}
): UserConfig {
  return mergeConfig(baseConfig, {
    test: {
      name: packageName,
      ...options.test,
    },
    ...options,
  })
}

/**
 * Coverage thresholds for different package types
 * Adjust these based on package complexity and criticality
 */
export const coverageThresholds = {
  // Pure utility packages (easy to test, high coverage expected)
  utils: {
    lines: 90,
    functions: 90,
    branches: 85,
    statements: 90,
  },

  // Database/schema packages (medium coverage)
  db: {
    lines: 70,
    functions: 70,
    branches: 60,
    statements: 70,
  },

  // Configuration packages (medium-low coverage)
  config: {
    lines: 50,
    functions: 50,
    branches: 40,
    statements: 50,
  },

  // UI/Component packages (medium coverage)
  ui: {
    lines: 60,
    functions: 60,
    branches: 55,
    statements: 60,
  },

  // Apps (medium coverage due to complexity)
  apps: {
    lines: 60,
    functions: 60,
    branches: 50,
    statements: 60,
  },
}

/**
 * Helper to resolve paths relative to package root
 */
export function resolvePath(...paths: string[]): string {
  return resolve(process.cwd(), ...paths)
}
