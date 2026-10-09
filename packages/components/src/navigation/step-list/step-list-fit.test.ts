import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { DsStepList, StepListStep } from './step-list.js';
import './define.js';
import { stepListStyles } from './step-list.styles.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const STEPS: StepListStep[] = [{ label: 'Name and size' }, { label: 'Visibility' }, { label: 'Vocabulary' }];

class FakeResizeObserver {
  static instances: FakeResizeObserver[] = [];
  readonly observed = new Set<Element>();
  readonly #callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.#callback = callback;
    FakeResizeObserver.instances.push(this);
  }

  observe(target: Element): void {
    this.observed.add(target);
  }

  unobserve(target: Element): void {
    this.observed.delete(target);
  }

  disconnect(): void {
    this.observed.clear();
  }

  notify(): void {
    this.#callback([], this as unknown as ResizeObserver);
  }
}

const realResizeObserver = globalThis.ResizeObserver;

beforeEach(() => {
  resetTestDom();
  FakeResizeObserver.instances = [];
  globalThis.ResizeObserver = FakeResizeObserver as unknown as typeof ResizeObserver;
});

afterEach(() => {
  globalThis.ResizeObserver = realResizeObserver;
});

function mountStepList(props: Partial<DsStepList> = {}): Promise<DsStepList> {
  return mountWithProps<DsStepList>('<ds-step-list></ds-step-list>', { steps: STEPS, currentIndex: 1, ...props });
}

function row(el: DsStepList): HTMLOListElement {
  return el.shadowRoot!.querySelector<HTMLOListElement>('[part="list"]')!;
}

function watchedElements(): Element[] {
  return FakeResizeObserver.instances.flatMap((observer) => [...observer.observed]);
}

async function layOutTheRow(el: DsStepList, { natural, available }: { natural: number; available: number }) {
  Object.defineProperty(row(el), 'scrollWidth', { configurable: true, value: Math.max(natural, available) });
  Object.defineProperty(row(el), 'clientWidth', { configurable: true, value: available });
  for (const observer of FakeResizeObserver.instances) {
    observer.notify();
  }
  await el.updateComplete;
}

function showsTheCompactLayout(el: DsStepList): boolean {
  return el.shadowRoot!.querySelector('nav')!.classList.contains('showing-compact');
}

describe('<ds-step-list> fitting the full row', () => {
  it('keeps the full row while every step fits on one line', async () => {
    const el = await mountStepList();
    await layOutTheRow(el, { natural: 600, available: 800 });

    expect(showsTheCompactLayout(el)).toBe(false);
  });

  it('switches to the compact layout once the full row no longer fits on one line', async () => {
    const el = await mountStepList();
    await layOutTheRow(el, { natural: 900, available: 800 });

    expect(showsTheCompactLayout(el)).toBe(true);
  });

  it('returns to the full row once there is room for it again', async () => {
    const el = await mountStepList();
    await layOutTheRow(el, { natural: 900, available: 800 });
    await layOutTheRow(el, { natural: 900, available: 1000 });

    expect(showsTheCompactLayout(el)).toBe(false);
  });

  it('watches each step as well as the row, so a longer label in the same width is noticed', async () => {
    const el = await mountStepList();
    const steps = [...row(el).querySelectorAll('.step-control')];

    expect(watchedElements()).toEqual(expect.arrayContaining([row(el), ...steps]));
    expect(steps).toHaveLength(3);
  });

  it('never wraps a label or a description in the full row', () => {
    expect(stepListStyles.cssText).toMatch(/ol :is\(\.step-label, \.step-description\)\s*{[^}]*white-space:\s*nowrap/s);
  });
});

describe('<ds-step-list> fitting when the host forces compact', () => {
  it('watches nothing while the host forces the compact layout', async () => {
    const el = await mountStepList({ compact: true });

    expect(watchedElements()).toEqual([]);
    expect(showsTheCompactLayout(el)).toBe(true);
  });

  it('starts watching the row as soon as the host stops forcing compact', async () => {
    const el = await mountStepList({ compact: true });
    el.compact = false;
    await el.updateComplete;

    expect(watchedElements()).toContain(row(el));
  });

  it('stops watching once the host forces compact again', async () => {
    const el = await mountStepList();
    el.compact = true;
    await el.updateComplete;

    expect(watchedElements()).toEqual([]);
  });

  it('stops watching once it leaves the page', async () => {
    const el = await mountStepList();
    el.remove();

    expect(watchedElements()).toEqual([]);
  });
});
