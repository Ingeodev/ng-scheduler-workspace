import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  // globalSetup: 'jest-preset-angular/global-setup',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/dist/',
  ],
  transformIgnorePatterns: [
    'node_modules/(?!.*\\.mjs$)'
  ],
  modulePathIgnorePatterns: ['<rootDir>/dist/'],
  moduleNameMapper: {
    '^ng-scheduler$': '<rootDir>/projects/ng-scheduler/src/public-api.ts',
    '^ng-scheduler/(.*)$': '<rootDir>/projects/ng-scheduler/src/lib/$1'
  }
};

export default config;
