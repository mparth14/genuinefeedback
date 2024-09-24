import type { Config } from 'jest';
import nextJest from 'next/jest';

// Provide the path to your Next.js app to load next.config.js and .env files in your test environment
const createJestConfig = nextJest({
  dir: './',
});

// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom', // Make sure you're using the correct environment for React components
  moduleNameMapper: {
    // Map the alias `@/` to the `src` folder
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Test Report"
    }]
  ]
};

export default createJestConfig(config);
