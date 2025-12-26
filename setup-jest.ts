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

/**
 * Mock PointerEvent for tests
 * JSDOM does not support PointerEvent by default
 */
if (!global.PointerEvent) {
  class PointerEvent extends MouseEvent {
    pointerId: number;
    pointerType: string;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 0;
      this.pointerType = params.pointerType || 'mouse';
    }
  }
  global.PointerEvent = PointerEvent as any;
}
