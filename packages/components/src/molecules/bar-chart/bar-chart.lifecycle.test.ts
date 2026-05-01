import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsBarChart } from './bar-chart.js';
import type { BarChartSeries } from './types.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

type Turn = { turn: number; Jess: number; Marco: number; Andrew: number };

const ROWS: readonly Turn[] = [
  { turn: 1, Jess: 3, Marco: 2, Andrew: 4 },
  { turn: 2, Jess: 2, Marco: 4, Andrew: 3 },
  { turn: 3, Jess: 5, Marco: 5, Andrew: 4 },
];

const SERIES: readonly BarChartSeries[] = [
  { key: 'Jess' },
  { key: 'Marco' },
  { key: 'Andrew' },
];

beforeAll(() => {
  if (!customElements.get('ds-bar-chart')) {
    customElements.define('ds-bar-chart', DsBarChart);
  }
});

beforeEach(() => {
  resetTestDom();
  globalThis.ResizeObserver = class {
    observe(): void {}
    disconnect(): void {}
    unobserve(): void {}
  } as unknown as typeof ResizeObserver;
});

describe('<ds-bar-chart> lifecycle coverage', () => {
  it('exposes computeLayoutSnapshot with grouped data', async () => {
    const originalRo = globalThis.ResizeObserver;
    globalThis.ResizeObserver = class {
      constructor(private readonly cb: ResizeObserverCallback) {}
      observe(): void {
        queueMicrotask(() => {
          this.cb([{ contentRect: { width: 222 } } as ResizeObserverEntry], this as unknown as ResizeObserver);
          this.cb([], this as unknown as ResizeObserver);
        });
      }
      disconnect(): void {}
      unobserve(): void {}
    } as unknown as typeof ResizeObserver;

    try {
      const el = await mountWithProps<DsBarChart<Turn>>('<ds-bar-chart></ds-bar-chart>', {
        data: ROWS,
        domain: 'turn',
        series: SERIES,
      }, 'ds-bar-chart');
      await Promise.resolve();
      await el.updateComplete;
      expect((el as unknown as { _width: number })._width).toBe(222);
      const snapshot = (el as unknown as { computeLayoutSnapshot: () => { groups: unknown[] } }).computeLayoutSnapshot();
      expect(snapshot.groups.length).toBeGreaterThan(0);
    } finally {
      globalThis.ResizeObserver = originalRo;
    }
  });

  it('updates width from requestAnimationFrame remeasure path', async () => {
    const originalRaf = globalThis.requestAnimationFrame;
    const originalRo = globalThis.ResizeObserver;
    globalThis.requestAnimationFrame = ((cb: FrameRequestCallback) => {
      queueMicrotask(() => cb(0));
      return 0;
    }) as typeof requestAnimationFrame;
    globalThis.ResizeObserver = undefined as never;

    const originalClientWidth = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientWidth');
    Object.defineProperty(HTMLElement.prototype, 'clientWidth', {
      configurable: true,
      get() {
        if (this.classList?.contains('frame')) return 321;
        return 0;
      },
    });

    try {
      const el = await mountWithProps<DsBarChart<Turn>>('<ds-bar-chart></ds-bar-chart>', {
        data: ROWS,
        domain: 'turn',
        series: SERIES,
      }, 'ds-bar-chart');
      await Promise.resolve();
      await el.updateComplete;
      expect((el as unknown as { _width: number })._width).toBe(321);
    } finally {
      if (originalClientWidth) {
        Object.defineProperty(HTMLElement.prototype, 'clientWidth', originalClientWidth);
      }
      globalThis.requestAnimationFrame = originalRaf;
      globalThis.ResizeObserver = originalRo;
    }
  });
});
