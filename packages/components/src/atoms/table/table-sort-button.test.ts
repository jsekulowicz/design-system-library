import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsTableSortButton } from './table-sort-button.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-table-sort-button')) {
    customElements.define('ds-table-sort-button', DsTableSortButton);
  }
});

beforeEach(() => {
  resetTestDom();
});

function click(el: DsTableSortButton): void {
  el.shadowRoot!.querySelector('button')!.click();
}

describe('<ds-table-sort-button>', () => {
  it('defaults direction to null', async () => {
    const el = await mount<DsTableSortButton>('<ds-table-sort-button></ds-table-sort-button>');
    expect(el.direction).toBeNull();
  });

  it('emits ds-sort with next direction on click (null -> asc -> desc -> null)', async () => {
    const el = await mount<DsTableSortButton>('<ds-table-sort-button></ds-table-sort-button>');
    const events: CustomEvent<{ direction: string | null }>[] = [];
    el.addEventListener('ds-sort', (e) => events.push(e as CustomEvent));

    click(el);
    expect(events[0]?.detail).toEqual({ direction: 'asc' });

    el.direction = 'asc';
    await el.updateComplete;
    click(el);
    expect(events[1]?.detail).toEqual({ direction: 'desc' });

    el.direction = 'desc';
    await el.updateComplete;
    click(el);
    expect(events[2]?.detail).toEqual({ direction: null });
  });

  it('reflects direction to attribute', async () => {
    const el = await mount<DsTableSortButton>('<ds-table-sort-button></ds-table-sort-button>');
    el.direction = 'asc';
    await el.updateComplete;
    expect(el.getAttribute('direction')).toBe('asc');
    el.direction = null;
    await el.updateComplete;
    expect(el.hasAttribute('direction')).toBe(false);
  });

  it('includes column in aria-label', async () => {
    const el = await mount<DsTableSortButton>('<ds-table-sort-button column="Name"></ds-table-sort-button>');
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.getAttribute('aria-label')).toBe('Sort by Name');
    el.direction = 'asc';
    await el.updateComplete;
    expect(btn.getAttribute('aria-label')).toBe('Sort by Name (ascending)');
  });

  it('uses the shared focus shadow for keyboard focus', () => {
    const css = (DsTableSortButton as unknown as { styles: { cssText: string }[] }).styles
      .map(style => style.cssText)
      .join('\n');
    expect(css).toContain('button:focus-visible');
    expect(css).toContain('box-shadow: var(--ds-shadow-focus)');
  });
});
