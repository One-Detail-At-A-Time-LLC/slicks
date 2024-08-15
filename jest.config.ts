/**
 * Jest configuration for Next.js projects
 */

import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const jestConfig: Config.InitialOptions = {
  clearMocks: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  coverageProvider: 'v8',
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  coverageReporters: ['text', 'lcov'],
}

export default nextJest(jestConfig)

