import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';
import '@testing-library/jest-dom';

setupZonelessTestEnv();

/**
 * Mock ResizeObserver for tests
 * ResizeObserver is a browser API not available in Jest/JSDOM
 */
global.ResizeObserver = class ResizeObserver {
  observe() { }
  unobserve() { }
  disconnect() { }
};
