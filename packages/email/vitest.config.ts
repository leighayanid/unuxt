import { defineConfig } from 'vitest/config'
import { definePackageConfig, coverageThresholds } from '../../vitest.shared'

export default defineConfig(
  definePackageConfig('@unuxt/email', {
    test: {
      coverage: {
        thresholds: coverageThresholds.utils,
      },
    },
  })
)
