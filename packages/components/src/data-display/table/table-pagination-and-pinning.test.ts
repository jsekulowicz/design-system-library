import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { DsTable } from './table.js';
import './define.js';
import type { TableColumn } from './types.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-table')) {
    customElements.define('ds-table', DsTable);
  }
});

interface Person {
  id: number;
  name: string;
  salary: number;
}

const ROWS: readonly Person[] = [
  { id: 1, name: 'Ada', salary: 100 },
  { id: 2, name: 'Bob', salary: 200 },
];

const COLUMNS: readonly TableColumn<Person>[] = [
  { name: 'name', field: 'name', label: 'Name', sortable: true },
  { name: 'salary', field: 'salary', label: 'Salary', align: 'right' },
];

async function mountTable(props: Partial<DsTable<Person>> = {}): Promise<DsTable<Person>> {
  return mountWithProps<DsTable<Person>>('<ds-table></ds-table>', {
    rows: ROWS,
    columns: COLUMNS,
    ...props,
  });
}

beforeEach(() => {
  resetTestDom();
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('<ds-table>', () => {
  describe('page change', () => {
    it('scrolls the body back to the top when a slotted pagination changes page', async () => {
      const el = await mountTable({ scrollBody: true });
      const scroller = el.shadowRoot!.querySelector('.scroll') as HTMLElement;
      scroller.scrollTop = 240;
      el.dispatchEvent(
        new CustomEvent('ds-page-change', {
          detail: { page: 2, pageSize: 20 },
          bubbles: true,
          composed: true,
        }),
      );
      expect(scroller.scrollTop).toBe(0);
    });

    it('brings the table back into view when the body is not the scroller', async () => {
      const el = await mountTable();
      const scrollIntoView = vi.fn();
      el.scrollIntoView = scrollIntoView;
      el.dispatchEvent(
        new CustomEvent('ds-page-change', {
          detail: { page: 2, pageSize: 20 },
          bubbles: true,
          composed: true,
        }),
      );
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
    });
  });

  describe('pinned columns', () => {
    const WIDE: readonly TableColumn<Person>[] = [
      { name: 'name', field: 'name', label: 'Name' },
      { name: 'role', field: 'salary', label: 'Role' },
      { name: 'salary', field: 'salary', label: 'Salary', align: 'right' },
    ];
    const WIDE_ROWS = [{ id: 1, name: 'Ada', salary: 100, role: 'Eng' }] as unknown as readonly Person[];

    const headerNames = (el: DsTable<Person>): string[] =>
      [...el.shadowRoot!.querySelectorAll('thead th')].map((th) => th.textContent!.trim());

    it('does not add pinned classes when pinnedColumns is empty', async () => {
      const el = await mountTable({ columns: WIDE, rows: WIDE_ROWS });
      expect(el.shadowRoot!.querySelector('.pinned')).toBeNull();
      expect(headerNames(el)).toEqual(['Name', 'Role', 'Salary']);
    });

    it('reorders pinned columns to the left without pinning the columns before them', async () => {
      const el = await mountTable({ columns: WIDE, rows: WIDE_ROWS, pinnedColumns: ['salary'] });
      expect(headerNames(el)).toEqual(['Salary', 'Name', 'Role']);
      const cells = el.shadowRoot!.querySelectorAll('tbody tr:first-child td');
      expect(cells[0].classList.contains('pinned')).toBe(true);
      expect(cells[1].classList.contains('pinned')).toBe(false);
    });

    it('preserves the original relative order of pinned columns', async () => {
      const el = await mountTable({ columns: WIDE, rows: WIDE_ROWS, pinnedColumns: ['salary', 'name'] });
      expect(headerNames(el)).toEqual(['Name', 'Salary', 'Role']);
    });

    it('marks only the last pinned column with pin-edge and sets the left offset var', async () => {
      const el = await mountTable({ columns: WIDE, rows: WIDE_ROWS, pinnedColumns: ['name', 'salary'] });
      const headers = el.shadowRoot!.querySelectorAll('thead th');
      expect(headers[0].classList.contains('pin-edge')).toBe(false);
      expect(headers[0].getAttribute('style')).toContain('--ds-table-pin-left-0');
      expect(headers[1].classList.contains('pin-edge')).toBe(true);
      expect(headers[1].getAttribute('style')).toContain('--ds-table-pin-left-1');
    });

    it('reorders the colgroup to match the pinned order', async () => {
      const columns: TableColumn<Person>[] = [
        { name: 'name', field: 'name', label: 'Name' },
        { name: 'salary', field: 'salary', label: 'Salary', width: '80px' },
      ];
      const el = await mountTable({ columns, rows: WIDE_ROWS, pinnedColumns: ['salary'] });
      const cols = el.shadowRoot!.querySelectorAll('colgroup col');
      expect(cols[0].getAttribute('style')).toContain('width: 80px');
    });

    it('ignores unknown and pinnable:false columns', async () => {
      const columns: TableColumn<Person>[] = [
        { name: 'name', field: 'name', label: 'Name', pinnable: false },
        { name: 'salary', field: 'salary', label: 'Salary' },
      ];
      const el = await mountTable({ columns, rows: WIDE_ROWS, pinnedColumns: ['name', 'ghost'] });
      expect(el.shadowRoot!.querySelector('.pinned')).toBeNull();
      expect(headerNames(el)).toEqual(['Name', 'Salary']);
    });

    it('includes sticky pinned-column styles capped by a max ratio', () => {
      const css = (DsTable as unknown as { styles: { cssText: string }[] }).styles
        .map((style) => style.cssText)
        .join('\n');
      expect(css).toContain('td.pinned');
      expect(css).toContain('position: sticky');
      expect(css).toContain('--ds-table-pin-max-ratio: 0.75');
      expect(css).toContain('--ds-table-pin-shadow');
    });
  });
});
