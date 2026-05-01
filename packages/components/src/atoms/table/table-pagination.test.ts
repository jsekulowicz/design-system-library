import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsTablePagination } from './table-pagination.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-table-pagination')) {
    customElements.define('ds-table-pagination', DsTablePagination);
  }
});

beforeEach(() => {
  resetTestDom();
});

async function mountPagination(props: Partial<DsTablePagination> = {}): Promise<DsTablePagination> {
  return mountWithProps<DsTablePagination>('<ds-table-pagination></ds-table-pagination>', {
    total: 100,
    pageSize: 10,
    page: 1,
    ...props,
  });
}

function getButton(el: DsTablePagination, label: string): HTMLButtonElement | null {
  const buttons = el.shadowRoot!.querySelectorAll('button');
  return Array.from(buttons).find(b => b.getAttribute('aria-label') === label) ?? null;
}

function getPageButton(el: DsTablePagination, page: number): HTMLButtonElement | null {
  return getButton(el, `Page ${page}`);
}

describe('<ds-table-pagination>', () => {
  it('disables Prev on page 1', async () => {
    const el = await mountPagination({ page: 1 });
    expect(getButton(el, 'Previous page')?.disabled).toBe(true);
  });

  it('disables Next on last page', async () => {
    const el = await mountPagination({ page: 10, pageSize: 10, total: 100 });
    expect(getButton(el, 'Next page')?.disabled).toBe(true);
  });

  it('emits ds-page-change with clicked page', async () => {
    const el = await mountPagination({ page: 1 });
    const events: CustomEvent<{ page: number; pageSize: number }>[] = [];
    el.addEventListener('ds-page-change', (e) => events.push(e as CustomEvent));
    getPageButton(el, 3)!.click();
    expect(events[0]?.detail).toEqual({ page: 3, pageSize: 10 });
  });

  it('emits ds-page-change for Next button', async () => {
    const el = await mountPagination({ page: 2 });
    const events: CustomEvent[] = [];
    el.addEventListener('ds-page-change', (e) => events.push(e as CustomEvent));
    getButton(el, 'Next page')!.click();
    expect(events[0]?.detail).toEqual({ page: 3, pageSize: 10 });
  });

  it('does not emit when clicking current page', async () => {
    const el = await mountPagination({ page: 3 });
    const events: CustomEvent[] = [];
    el.addEventListener('ds-page-change', (e) => events.push(e as CustomEvent));
    getPageButton(el, 3)!.click();
    expect(events).toHaveLength(0);
  });

  it('marks current page with aria-current="page"', async () => {
    const el = await mountPagination({ page: 2 });
    expect(getPageButton(el, 2)?.getAttribute('aria-current')).toBe('page');
    expect(getPageButton(el, 1)?.hasAttribute('aria-current')).toBe(false);
  });

  it('computes totalPages with non-clean multiple', async () => {
    const el = await mountPagination({ total: 25, pageSize: 10 });
    expect(getPageButton(el, 3)).not.toBeNull();
    expect(getPageButton(el, 4)).toBeNull();
  });

  it('clamps to single page when total=0', async () => {
    const el = await mountPagination({ total: 0, pageSize: 10 });
    expect(getButton(el, 'Previous page')?.disabled).toBe(true);
    expect(getButton(el, 'Next page')?.disabled).toBe(true);
    expect(getPageButton(el, 1)).not.toBeNull();
  });

  it('emits ds-page-size-change with adjusted page keeping first visible row stable', async () => {
    const el = await mountPagination({ page: 3, pageSize: 10, pageSizeOptions: [10, 25, 50] });
    const events: CustomEvent<{ pageSize: number; page: number }>[] = [];
    el.addEventListener('ds-page-size-change', (e) => events.push(e as CustomEvent));
    const select = el.shadowRoot!.querySelector('select')!;
    select.value = '25';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(events[0]?.detail.pageSize).toBe(25);
    expect(events[0]?.detail.page).toBe(1);
  });

  it('ignores invalid page-size changes', async () => {
    const el = await mountPagination({ page: 3, pageSize: 10, pageSizeOptions: [10, 25, 50] });
    const events: CustomEvent[] = [];
    el.addEventListener('ds-page-size-change', (e) => events.push(e as CustomEvent));
    const select = el.shadowRoot!.querySelector('select')!;
    select.value = '0';
    select.dispatchEvent(new Event('change', { bubbles: true }));
    expect(events).toHaveLength(0);
  });

  it('renders hidePageNumbers with a compact label', async () => {
    const el = await mountPagination({ hidePageNumbers: true, page: 3, pageSize: 10, total: 50 });
    expect(getPageButton(el, 2)).toBeNull();
    expect(el.shadowRoot!.textContent).toContain('Page 3 of 5');
  });

  it('renders summary text', async () => {
    const el = await mountPagination({ page: 2, pageSize: 10, total: 100 });
    expect(el.shadowRoot!.textContent).toContain('Showing 11–20 of 100');
  });

  it('renders "No results" summary when total is 0', async () => {
    const el = await mountPagination({ total: 0 });
    expect(el.shadowRoot!.textContent).toContain('No results');
  });
});
