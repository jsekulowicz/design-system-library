import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsTableSortButton } from './table-sort-button.js';
import './define.js';

beforeAll(() => {
  if (!customElements.get('ds-table-sort-button')) {
    customElements.define('ds-table-sort-button', DsTableSortButton);
  }
});

beforeEach(() => {
  document.body.innerHTML = '';
});

async function mount(attrs = ''): Promise<DsTableSortButton> {
  document.body.innerHTML = `<ds-table-sort-button ${attrs}></ds-table-sort-button>`;
  const el = document.body.firstElementChild as DsTableSortButton;
  await el.updateComplete;
  return el;
}

function click(el: DsTableSortButton): void {
  el.shadowRoot!.querySelector('button')!.click();
}

describe('<ds-table-sort-button>', () => {
  it('defaults direction to null', async () => {
    const el = await mount();
    expect(el.direction).toBeNull();
  });

  it('emits ds-sort with next direction on click (null -> asc -> desc -> null)', async () => {
    const el = await mount();
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
    const el = await mount();
    el.direction = 'asc';
    await el.updateComplete;
    expect(el.getAttribute('direction')).toBe('asc');
    el.direction = null;
    await el.updateComplete;
    expect(el.hasAttribute('direction')).toBe(false);
  });

  it('sets aria-pressed based on direction', async () => {
    const el = await mount();
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.getAttribute('aria-pressed')).toBe('false');
    el.direction = 'asc';
    await el.updateComplete;
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('includes column in aria-label', async () => {
    const el = await mount('column="Name"');
    const btn = el.shadowRoot!.querySelector('button')!;
    expect(btn.getAttribute('aria-label')).toBe('Sort by Name');
    el.direction = 'asc';
    await el.updateComplete;
    expect(btn.getAttribute('aria-label')).toBe('Sort by Name (ascending)');
  });
});
