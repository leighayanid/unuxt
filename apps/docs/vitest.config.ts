import { defineConfig } from 'vitest/config'
import { definePackageConfig, coverageThresholds } from '../../vitest.shared'

export default defineConfig(
  definePackageConfig('@unuxt/docs', {
    test: {
      coverage: {
        thresholds: coverageThresholds.apps,
      },
    },
  })
)
