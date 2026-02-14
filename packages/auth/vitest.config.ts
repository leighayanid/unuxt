import { defineConfig } from 'vitest/config'
import { definePackageConfig, coverageThresholds } from '../../vitest.shared'

export default defineConfig(
  definePackageConfig('@unuxt/auth', {
    test: {
      coverage: {
        thresholds: coverageThresholds.config,
      },
      env: {
        BETTER_AUTH_SECRET: 'test-secret-key-for-testing-only',
        BETTER_AUTH_URL: 'http://localhost:3000',
      },
    },
  })
)
