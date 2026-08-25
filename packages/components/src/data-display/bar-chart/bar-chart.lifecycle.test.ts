import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsBarChart } from './bar-chart.js';
import type { BarChartSeries } from './types.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

interface MetricRow {
  period: number;
  Website: number;
  Mobile: number;
  Partners: number;
}

const ROWS: readonly MetricRow[] = [
  { period: 1, Website: 3, Mobile: 2, Partners: 4 },
  { period: 2, Website: 2, Mobile: 4, Partners: 3 },
  { period: 3, Website: 5, Mobile: 5, Partners: 4 },
];

const SERIES: readonly BarChartSeries[] = [{ key: 'Website' }, { key: 'Mobile' }, { key: 'Partners' }];

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
  it('renders the svg at the observed width', async () => {
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
      const el = await mountWithProps<DsBarChart<MetricRow>>(
        '<ds-bar-chart></ds-bar-chart>',
        {
          data: ROWS,
          domain: 'period',
          series: SERIES,
        },
        'ds-bar-chart',
      );
      await Promise.resolve();
      await el.updateComplete;
      expect((el as unknown as { _width: number })._width).toBe(222);
      const svg = el.shadowRoot!.querySelector('svg')!;
      expect(svg.getAttribute('viewBox')).toBe('0 0 222 320');
      expect(el.shadowRoot!.querySelectorAll('.bar-group').length).toBeGreaterThan(0);
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
        if (this.classList?.contains('frame')) {
          return 321;
        }
        return 0;
      },
    });

    try {
      const el = await mountWithProps<DsBarChart<MetricRow>>(
        '<ds-bar-chart></ds-bar-chart>',
        {
          data: ROWS,
          domain: 'period',
          series: SERIES,
        },
        'ds-bar-chart',
      );
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

  it('observes the rendered chart frame after loading finishes', async () => {
    const originalRo = globalThis.ResizeObserver;
    const observedFrames: Element[] = [];
    globalThis.ResizeObserver = class {
      constructor(private readonly cb: ResizeObserverCallback) {}
      observe(target: Element): void {
        observedFrames.push(target);
        const width = target.classList.contains('loading-frame') ? 640 : 960;
        queueMicrotask(() => {
          this.cb([{ contentRect: { width } } as ResizeObserverEntry], this as unknown as ResizeObserver);
        });
      }
      disconnect(): void {}
      unobserve(): void {}
    } as unknown as typeof ResizeObserver;

    try {
      const el = await mountWithProps<DsBarChart<MetricRow>>(
        '<ds-bar-chart></ds-bar-chart>',
        {
          data: ROWS,
          domain: 'period',
          series: SERIES,
          loading: true,
        },
        'ds-bar-chart',
      );
      el.loading = false;
      await el.updateComplete;
      await Promise.resolve();
      await el.updateComplete;

      const frame = el.shadowRoot!.querySelector('.frame')!;
      expect(observedFrames.at(-1)).toBe(frame);
      expect(el.shadowRoot!.querySelector('svg')?.getAttribute('viewBox')).toBe('0 0 960 320');
    } finally {
      globalThis.ResizeObserver = originalRo;
    }
  });
});
