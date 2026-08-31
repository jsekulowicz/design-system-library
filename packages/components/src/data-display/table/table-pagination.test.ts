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
  return Array.from(buttons).find((b) => b.getAttribute('aria-label') === label) ?? null;
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
    expect(el.shadowRoot!.textContent).toContain('Showing 11-20 of 100');
  });

  it('renders "No results" summary when total is 0', async () => {
    const el = await mountPagination({ total: 0 });
    expect(el.shadowRoot!.textContent).toContain('No results');
  });

  it('keeps the prev/next label slot wrapped in a styleable span', async () => {
    const el = await mountPagination();
    // The label wrapper is always present so ::part(prev-next-label)
    // and the internal [compact] visibility rule have something to
    // target. Slot fallback text "Previous" / "Next" still resolves
    // through the slot.
    const labels = el.shadowRoot!.querySelectorAll('span.label');
    expect(labels.length).toBe(2);
  });

  it('falls back to the compact page range when forced into compact mode', async () => {
    const el = await mountPagination({ page: 50, pageSize: 10, total: 1000 });
    el.compact = true;
    await el.updateComplete;
    // Compact mode caps the range at three items + first/last: with
    // currentPage = 50 we expect [1, ..., 50, ..., 100].
    const pageButtons = Array.from(el.shadowRoot!.querySelectorAll('button[aria-label^="Page "]'));
    const pages = pageButtons.map((b) => Number(b.getAttribute('aria-label')!.replace('Page ', '')));
    expect(pages).toEqual([1, 50, 100]);
  });

  it('uses the shared focus shadow for buttons and the page size select', () => {
    const css = (DsTablePagination as unknown as { styles: { cssText: string }[] }).styles
      .map((style) => style.cssText)
      .join('\n');
    expect(css).toContain('button:focus-visible');
    expect(css).toContain('select:focus-visible');
    expect(css).toContain('box-shadow: var(--ds-shadow-focus)');
  });

  describe('translatable labels', () => {
    it('names the nav landmark', async () => {
      const el = await mountPagination({ label: 'Paginación' });
      expect(el.shadowRoot!.querySelector('nav')?.getAttribute('aria-label')).toBe('Paginación');
    });

    it('names the previous and next buttons', async () => {
      const el = await mountPagination({
        page: 2,
        prevPageLabel: 'Página anterior',
        nextPageLabel: 'Página siguiente',
      });
      expect(getButton(el, 'Página anterior')?.disabled).toBe(false);
      expect(getButton(el, 'Página siguiente')?.disabled).toBe(false);
    });

    it('substitutes the page number into a page button label', async () => {
      const el = await mountPagination({ pageLabel: 'Página {page}' });
      expect(getButton(el, 'Página 3')).not.toBeNull();
    });

    it('substitutes the range into the summary', async () => {
      const el = await mountPagination({
        total: 69,
        pageSize: 30,
        page: 2,
        summaryLabel: 'Mostrando {start}-{end} de {total}',
      });
      expect(el.shadowRoot!.querySelector('[part~="summary"]')?.textContent?.trim()).toBe('Mostrando 31-60 de 69');
    });

    it('uses the empty label when nothing matched', async () => {
      const el = await mountPagination({ total: 0, emptyLabel: 'Sin resultados' });
      expect(el.shadowRoot!.querySelector('[part~="summary"]')?.textContent?.trim()).toBe('Sin resultados');
    });

    it('substitutes page and total into the hide-page-numbers text', async () => {
      const el = await mountPagination({
        hidePageNumbers: true,
        page: 2,
        pageOfLabel: 'Página {page} de {total}',
      });
      expect(el.shadowRoot!.textContent).toContain('Página 2 de 10');
    });

    it('labels the page-size select', async () => {
      const el = await mountPagination({
        pageSizeOptions: [10, 20],
        rowsPerPageLabel: 'Filas por página',
      });
      const select = el.shadowRoot!.querySelector('select');
      expect(select?.getAttribute('aria-label')).toBe('Filas por página');
      expect(el.shadowRoot!.querySelector('label')?.textContent).toContain('Filas por página');
    });

    it('leaves a placeholder named after an inherited object member alone', async () => {
      const el = await mountPagination({ summaryLabel: '{start} of {constructor}' });
      expect(el.shadowRoot!.querySelector('[part~="summary"]')?.textContent?.trim()).toBe('1 of {constructor}');
    });

    it('leaves an unknown placeholder alone rather than printing undefined', async () => {
      const el = await mountPagination({ summaryLabel: '{start} of {nope}' });
      expect(el.shadowRoot!.querySelector('[part~="summary"]')?.textContent?.trim()).toBe('1 of {nope}');
    });
  });
});
