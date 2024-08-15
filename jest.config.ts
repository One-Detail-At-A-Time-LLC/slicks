import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const jestConfig: Config = {
  automock: false,
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['<rootDir>/node_modules/'],
  coverageReporters: ['json', 'text', 'lcov', 'clover'],
  testEnvironment: 'jest-environment-node',
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[tj]s?(x)'],
  testPathIgnorePatterns: ['<rootDir>/node_modules/'],
  testRunner: 'jest-circus/runner',
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest',
  },
  moduleNameMapper: {
    '^@components/(.*)$': '<rootDir>/components/$1',
  },
  globals: {
    window: {},
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
};

export default createJestConfig(jestConfig);

