import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    include: ['src/**/*.test.tsx', 'src/**/*.test.ts'],
    exclude: [
      'src/tests/integration/checkout.full.test.ts',
      'src/tests/integration/checkout.safe.test.ts',
      'src/tests/integration/admin-leads.test.tsx',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
      // basic global thresholds (CI will fail if not met)
      lines: 80,
      statements: 80,
      functions: 80,
      branches: 70,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
