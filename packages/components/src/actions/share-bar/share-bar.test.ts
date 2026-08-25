import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsShareBar } from './share-bar.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-share-bar')) {
    customElements.define('ds-share-bar', DsShareBar);
  }
});

beforeEach(() => {
  resetTestDom();
});

function segmentGrow(el: DsShareBar): string[] {
  return [...el.shadowRoot!.querySelectorAll<HTMLElement>('[part="segment"]')].map((node) => node.style.flexGrow);
}

function legendText(el: DsShareBar): string[] {
  return [...el.shadowRoot!.querySelectorAll('.legend li')].map((node) =>
    node.textContent!.replace(/\s+/g, ' ').trim(),
  );
}

function segmentColors(el: DsShareBar): string[] {
  return [...el.shadowRoot!.querySelectorAll<HTMLElement>('[part="segment"]')].map((node) => node.style.background);
}

async function mountWith(data: { label: string; value: number }[], attrs = ''): Promise<DsShareBar> {
  const el = await mount<DsShareBar>(`<ds-share-bar ${attrs}></ds-share-bar>`);
  el.data = data;
  await el.updateComplete;
  return el;
}

describe('<ds-share-bar>', () => {
  it('lets flex distribute the bar from the raw values rather than computed widths', async () => {
    const el = await mountWith([
      { label: 'A', value: 30 },
      { label: 'B', value: 10 },
    ]);
    expect(segmentGrow(el)).toEqual(['30', '10']);
  });

  it('keeps the order the caller supplied rather than sorting by value', async () => {
    const el = await mountWith([
      { label: 'Easy', value: 1 },
      { label: 'Medium', value: 8 },
      { label: 'Hard', value: 3 },
    ]);
    expect(legendText(el)).toEqual(['Easy 8%', 'Medium 67%', 'Hard 25%']);
  });

  it('rolls the smallest values past max-segments into one Other segment', async () => {
    const el = await mountWith(
      [
        { label: 'A', value: 50 },
        { label: 'B', value: 30 },
        { label: 'C', value: 10 },
        { label: 'D', value: 6 },
        { label: 'E', value: 4 },
      ],
      'max-segments="3" other-label="Other"',
    );
    expect(legendText(el)).toEqual(['A 50%', 'B 30%', 'Other 20%']);
  });

  it('does not roll a single overflow item into Other', async () => {
    const el = await mountWith(
      [
        { label: 'A', value: 50 },
        { label: 'B', value: 30 },
        { label: 'C', value: 20 },
      ],
      'max-segments="3"',
    );
    expect(legendText(el)).toEqual(['A 50%', 'B 30%', 'C 20%']);
  });

  it('gives adjacent segments colors from different token families', async () => {
    const el = await mountWith([
      { label: 'A', value: 1 },
      { label: 'B', value: 1 },
    ]);
    expect(segmentColors(el)).toEqual(['var(--ds-color-chart-1)', 'var(--ds-color-chart-3)']);
  });

  it('paints the Other segment in the muted foreground, not a category color', async () => {
    const el = await mountWith(
      [
        { label: 'A', value: 50 },
        { label: 'B', value: 5 },
        { label: 'C', value: 3 },
      ],
      'max-segments="2"',
    );
    expect(segmentColors(el)).toEqual(['var(--ds-color-chart-1)', 'var(--ds-color-fg-muted)']);
  });

  it('shows the empty label instead of a legend when every value is zero', async () => {
    const el = await mountWith([{ label: 'A', value: 0 }], 'empty-label="No data yet"');
    expect(el.shadowRoot!.querySelector('.legend')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="empty"]')!.textContent).toContain('No data yet');
  });

  it('describes the whole bar for screen readers', async () => {
    const el = await mountWith(
      [
        { label: 'A', value: 3 },
        { label: 'B', value: 1 },
      ],
      'title="Sizes"',
    );
    expect(el.shadowRoot!.querySelector('[part="bar"]')!.getAttribute('aria-label')).toBe('Sizes: A 75%, B 25%');
  });

  it('formats percentages through formatPercent when given one', async () => {
    const el = await mountWith([{ label: 'A', value: 1 }]);
    el.formatPercent = (percent) => `${percent.toFixed(1)} pct`;
    await el.updateComplete;
    expect(legendText(el)).toEqual(['A 100.0 pct']);
  });

  it('ignores negative and non-finite values', async () => {
    const el = await mountWith([
      { label: 'A', value: 10 },
      { label: 'B', value: -5 },
      { label: 'C', value: Number.NaN },
    ]);
    expect(legendText(el)).toEqual(['A 100%']);
  });
});
