import { defineConfig } from 'vitest/config'
import { definePackageConfig, coverageThresholds } from '../../vitest.shared'

export default defineConfig(
  definePackageConfig('@unuxt/db', {
    test: {
      coverage: {
        thresholds: coverageThresholds.db,
      },
    },
  })
)
