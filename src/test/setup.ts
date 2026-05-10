import '@testing-library/jest-dom/vitest';

if (typeof globalThis.PointerEvent === 'undefined') {
  class PointerEvent extends MouseEvent {
    public pointerId: number;
    constructor(type: string, params: PointerEventInit = {}) {
      super(type, params);
      this.pointerId = params.pointerId || 0;
    }
  }
  globalThis.PointerEvent = PointerEvent as any;
}

if (typeof globalThis.HTMLElement.prototype.setPointerCapture === 'undefined') {
  globalThis.HTMLElement.prototype.setPointerCapture = function() {};
  globalThis.HTMLElement.prototype.releasePointerCapture = function() {};
  globalThis.HTMLElement.prototype.hasPointerCapture = function() { return false; };
}
