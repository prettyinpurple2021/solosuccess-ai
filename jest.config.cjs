const nextJest = require('next/jest')

const createJestConfig = nextJest({ dir: './' })

/** @type {import('jest').Config} */
const customJestConfig = {
  // Default to node for server tests
  testEnvironment: 'node',
  testMatch: ['**/*.test.{ts,tsx}', '**/__tests__/**/*.{ts,tsx}'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    '/.next/',
    '/coverage/',
    'eslint.config.test.js',
    // Exclude Vitest test files (they use vitest, not jest)
    '.*PrivacyPolicy\\.test\\.tsx$',
    '.*TermsOfService\\.test\\.tsx$',
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Ensure coverage reports are generated in formats that Codecov understands
  coverageDirectory: 'coverage',
  coverageReporters: ['lcov', 'json-summary', 'clover', 'text', 'text-summary'],
  // Add timeout and force exit to handle hanging processes
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: true,
  // Global teardown to clean up any remaining resources
  globalTeardown: '<rootDir>/jest.teardown.cjs',
}

module.exports = createJestConfig(customJestConfig)