import { defineConfig } from 'vitest/config'
import { definePackageConfig, coverageThresholds } from '../../vitest.shared'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig(
  definePackageConfig('@unuxt/web', {
    plugins: [vue()],
    test: {
      environment: 'happy-dom',
      setupFiles: ['./tests/setup.ts'],
      include: ['**/*.test.ts'],
      exclude: [
        '**/node_modules/**',
        '**/.nuxt/**',
        '**/.output/**',
        '**/coverage/**',
        '**/tests/e2e/**/*.spec.ts', // Exclude E2E tests (run with Playwright)
      ],
      coverage: {
        thresholds: coverageThresholds.apps,
        exclude: [
          '**/node_modules/**',
          '**/.nuxt/**',
          '**/.output/**',
          '**/coverage/**',
          '**/*.config.{ts,js}',
          '**/*.d.ts',
          '**/tests/**',
          '**/*.test.{ts,js}',
          '**/*.spec.{ts,js}',
          // Exclude generated types and middleware
          '**/server/middleware/**',
          '**/app.vue',
          '**/error.vue',
        ],
      },
    },
    resolve: {
      alias: {
        '~': fileURLToPath(new URL('./app', import.meta.url)),
        '@': fileURLToPath(new URL('./app', import.meta.url)),
        '#app': fileURLToPath(new URL('./app', import.meta.url)),
      },
    },
  })
)
