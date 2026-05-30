import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { html } from 'lit';
import { DsTable } from './table.js';
import './define.js';
import type { TableColumn, TableSortState } from './types.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-table')) {
    customElements.define('ds-table', DsTable);
  }
});

type Person = { id: number; name: string; salary: number };

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

describe('<ds-table>', () => {
  it('renders one row per item with cells from row fields', async () => {
    const el = await mountTable();
    const rows = el.shadowRoot!.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('Ada');
    expect(rows[0].textContent).toContain('100');
  });

  it('reflects the scroll-body attribute', async () => {
    const el = await mountTable({ scrollBody: true });
    expect(el.hasAttribute('scroll-body')).toBe(true);
  });

  it('applies align class to cells', async () => {
    const el = await mountTable();
    const cells = el.shadowRoot!.querySelectorAll('tbody tr:first-child td');
    expect(cells[0].classList.contains('align-left')).toBe(true);
    expect(cells[1].classList.contains('align-right')).toBe(true);
  });

  it('defaults to stacked responsive mode', async () => {
    const el = await mountTable();
    expect(el.responsive).toBe('stack');
    expect(el.getAttribute('responsive')).toBe('stack');
  });

  it('supports horizontal scroll responsive mode', async () => {
    const el = await mountWithProps<DsTable<Person>>(
      '<ds-table responsive="scroll"></ds-table>',
      { rows: ROWS, columns: COLUMNS },
    );
    expect(el.responsive).toBe('scroll');
    expect(el.getAttribute('responsive')).toBe('scroll');
  });

  it('adds column labels to cells for stacked mobile layout', async () => {
    const el = await mountTable();
    const cells = el.shadowRoot!.querySelectorAll('tbody tr:first-child td');
    expect(cells[0].getAttribute('data-label')).toBe('Name');
    expect(cells[1].getAttribute('data-label')).toBe('Salary');
  });

  it('calls column.render(row, index) when provided', async () => {
    const received: { name: string; index: number }[] = [];
    const columns: TableColumn<Person>[] = [
      {
        name: 'name', field: 'name', label: 'Name',
        render: (row, index) => {
          received.push({ name: row.name, index });
          return html`<em>${row.name.toUpperCase()}</em>`;
        },
      },
    ];
    const el = await mountTable({ columns });
    expect(received).toEqual([{ name: 'Ada', index: 0 }, { name: 'Bob', index: 1 }]);
    expect(el.shadowRoot!.querySelector('em')?.textContent).toBe('ADA');
  });

  it('shows empty slot fallback when rows is empty', async () => {
    const el = await mountTable({ rows: [] });
    expect(el.shadowRoot!.querySelector('[part="empty"]')?.textContent).toContain('No data');
  });

  it('exposes the scroll wrapper via the `scroll` csspart so consumers can delegate vertical scrolling to it', async () => {
    const el = await mountTable();
    expect(el.shadowRoot!.querySelector('[part="scroll"]')).not.toBeNull();
  });

  it('omits the toolbar and footer wrappers when nothing is slotted into them', async () => {
    const el = await mountTable();
    expect(el.shadowRoot!.querySelector('[part="toolbar"]')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="footer"]')).toBeNull();
  });

  it('renders the toolbar wrapper once content is slotted in', async () => {
    const el = await mountWithProps<DsTable<Person>>(
      '<ds-table><div slot="toolbar">filters</div></ds-table>',
      { rows: ROWS, columns: COLUMNS },
    );
    expect(el.shadowRoot!.querySelector('[part="toolbar"]')).not.toBeNull();
  });

  it('renders the footer wrapper once content is slotted in', async () => {
    const el = await mountWithProps<DsTable<Person>>(
      '<ds-table><div slot="footer">pagination</div></ds-table>',
      { rows: ROWS, columns: COLUMNS },
    );
    expect(el.shadowRoot!.querySelector('[part="footer"]')).not.toBeNull();
  });

  it('does not render a caption element without caption slot content', async () => {
    const el = await mountTable();
    expect(el.shadowRoot!.querySelector('caption')).toBeNull();
  });

  it('renders caption element when caption slot content is provided', async () => {
    const el = await mountWithProps<DsTable<Person>>(
      '<ds-table><span slot="caption">Team roster</span></ds-table>',
      { rows: ROWS, columns: COLUMNS },
    );
    const caption = el.shadowRoot!.querySelector('caption') as HTMLTableCaptionElement;
    expect(caption).not.toBeNull();
    expect(caption.querySelector('slot[name="caption"]')).not.toBeNull();
  });

  it('sets aria-sort from sortState on sortable columns', async () => {
    const sortState: TableSortState = { name: 'name', direction: 'asc' };
    const el = await mountTable({ sortState });
    const headers = el.shadowRoot!.querySelectorAll('thead th');
    expect(headers[0].getAttribute('aria-sort')).toBe('ascending');
    expect(headers[1].hasAttribute('aria-sort')).toBe(false);
  });

  it('sets aria-sort="none" on sortable columns when no sort state matches', async () => {
    const el = await mountTable();
    const headers = el.shadowRoot!.querySelectorAll('thead th');
    expect(headers[0].getAttribute('aria-sort')).toBe('none');
  });

  it('sets aria-sort="descending" for desc sort direction', async () => {
    const sortState: TableSortState = { name: 'name', direction: 'desc' };
    const el = await mountTable({ sortState });
    const headers = el.shadowRoot!.querySelectorAll('thead th');
    expect(headers[0].getAttribute('aria-sort')).toBe('descending');
  });

  it('renders empty text for nullish cell values', async () => {
    const rows = [{ id: 1, name: null, salary: 100 }] as unknown as readonly Person[];
    const columns: TableColumn<Person>[] = [{ name: 'name', field: 'name', label: 'Name' }];
    const el = await mountTable({ rows, columns });
    const cell = el.shadowRoot!.querySelector('tbody td') as HTMLTableCellElement;
    expect(cell.textContent?.trim()).toBe('');
  });

  it('applies column width style when width is provided', async () => {
    const columns: TableColumn<Person>[] = [
      { name: 'name', field: 'name', label: 'Name', width: '140px' },
      { name: 'salary', field: 'salary', label: 'Salary' },
    ];
    const el = await mountTable({ columns });
    const col = el.shadowRoot!.querySelector('colgroup col') as HTMLTableColElement;
    expect(col.getAttribute('style')).toContain('width: 140px');
  });

  it('renders a skeleton table before columns are initialized', async () => {
    const el = await mountTable({ rows: [], columns: [], skeletonRows: 2, skeletonColumns: 3 });
    expect(el.shadowRoot!.querySelector('table.skeleton-table')).not.toBeNull();
    expect(el.shadowRoot!.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(el.shadowRoot!.querySelectorAll('thead th')).toHaveLength(3);
  });

  it('renders label and value skeletons for stacked mobile layout', async () => {
    const el = await mountTable({ rows: [], columns: [], skeletonRows: 2, skeletonColumns: 3 });
    const firstCell = el.shadowRoot!.querySelector('tbody td') as HTMLTableCellElement;
    expect(firstCell.querySelector('.skeleton-label')).not.toBeNull();
    expect(firstCell.querySelector('.skeleton-value')).not.toBeNull();
    expect(firstCell.querySelector('.skeleton-label')?.getAttribute('width')).not.toBe(
      firstCell.querySelector('.skeleton-value')?.getAttribute('width'),
    );
  });

  it('renders a skeleton instead of the loading overlay when loading without rows', async () => {
    const el = await mountTable({ rows: [], columns: COLUMNS, loading: true });
    expect(el.shadowRoot!.querySelector('table.skeleton-table')).not.toBeNull();
    expect(el.shadowRoot!.querySelectorAll('thead th')).toHaveLength(COLUMNS.length);
    expect(el.shadowRoot!.querySelector('[part="loading"]')).toBeNull();
    expect(el.shadowRoot!.querySelector('[part="empty"]')).toBeNull();
  });

  it('includes stacked skeleton styles for narrow containers', () => {
    const css = (DsTable as unknown as { styles: { cssText: string }[] }).styles
      .map(style => style.cssText)
      .join('\n');
    expect(css).toContain('.skeleton-table');
    expect(css).toContain('min-width: 0');
    expect(css).toContain('content: none');
    expect(css).toContain('overflow-wrap: anywhere');
  });

  it('shows a loading overlay over initialized data', async () => {
    const el = await mountTable({ loading: true });
    const table = el.shadowRoot!.querySelector('table') as HTMLTableElement;
    const loading = el.shadowRoot!.querySelector('[part="loading"]') as HTMLElement;
    expect(table.getAttribute('aria-busy')).toBe('true');
    expect(el.hasAttribute('loading')).toBe(false);
    expect(loading.getAttribute('role')).toBe('status');
    expect(loading.textContent).toContain('Loading...');
  });

  it('treats loading="false" as false for string-based integrations', async () => {
    const el = await mountWithProps<DsTable<Person>>(
      '<ds-table loading="false"></ds-table>',
      { rows: ROWS, columns: COLUMNS },
    );
    expect(el.loading).toBe(false);
    expect(el.shadowRoot!.querySelector('[part="loading"]')).toBeNull();
  });

  it('renders slotted loading content', async () => {
    const el = await mountWithProps<DsTable<Person>>(
      '<ds-table><span slot="loading">Chargement...</span></ds-table>',
      { rows: ROWS, columns: COLUMNS, loading: true },
    );
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="loading"]')!;
    const assigned = slot.assignedElements();
    expect(assigned[0].textContent).toBe('Chargement...');
  });

  describe('clickable rows', () => {
    it('fires ds-row-click on click when clickable-rows is set', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent<{ row: Person; index: number }>[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events[0]?.detail.row).toEqual(ROWS[0]);
      expect(events[0]?.detail.index).toBe(0);
    });

    it('does not fire when clickable-rows is unset', async () => {
      const el = await mountTable({ clickableRows: false });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events).toHaveLength(0);
    });

    it('fires on Enter and Space keydown', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
      tr.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true }));
      expect(events).toHaveLength(2);
    });

    it('does not fire on non-activation keydown', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true, composed: true }));
      expect(events).toHaveLength(0);
    });

    it('does not fire when the click target is inside an interactive descendant', async () => {
      const columns: TableColumn<Person>[] = [
        { name: 'name', field: 'name', label: 'Name' },
        {
          name: 'action', field: 'id', label: '',
          render: (row) => html`<button data-id=${row.id}>Edit</button>`,
        },
      ];
      const el = await mountTable({ columns, clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const button = el.shadowRoot!.querySelector('button[data-id]') as HTMLButtonElement;
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events).toHaveLength(0);
    });

    it('does not fire when the click target has role=button', async () => {
      const columns: TableColumn<Person>[] = [
        { name: 'name', field: 'name', label: 'Name' },
        {
          name: 'action', field: 'id', label: '',
          render: () => html`<span role="button">Open</span>`,
        },
      ];
      const el = await mountTable({ columns, clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const roleButton = el.shadowRoot!.querySelector('span[role="button"]') as HTMLSpanElement;
      roleButton.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events).toHaveLength(0);
    });

    it('fires when click originates in non-interactive descendants', async () => {
      const columns: TableColumn<Person>[] = [
        { name: 'name', field: 'name', label: 'Name' },
        {
          name: 'meta', field: 'id', label: '',
          render: () => html`<span class="meta"><span class="text">Open</span></span>`,
        },
      ];
      const el = await mountTable({ columns, clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const text = el.shadowRoot!.querySelector('.text')!.firstChild as Text;
      text.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events).toHaveLength(1);
    });

    it('still fires when composedPath has no tr element', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr') as HTMLTableRowElement;
      const event = new MouseEvent('click', { bubbles: true, composed: true });
      Object.defineProperty(event, 'composedPath', {
        configurable: true,
        value: () => [document.createTextNode('x'), document.createElement('span')],
      });
      tr.dispatchEvent(event);
      expect(events).toHaveLength(1);
    });

    it('sets role=button and tabindex=0 on rows when clickable', async () => {
      const el = await mountTable({ clickableRows: true });
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      expect(tr.getAttribute('role')).toBe('button');
      expect(tr.getAttribute('tabindex')).toBe('0');
    });
  });
});
