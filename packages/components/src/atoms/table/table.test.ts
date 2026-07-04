import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
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

afterEach(() => {
  vi.restoreAllMocks();
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

  it('wraps each cell in a named slot when row-key is set, with the value as fallback', async () => {
    const el = await mountTable({ rowKey: 'id' });
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('tbody slot[name="cell:name:1"]');
    expect(slot).not.toBeNull();
    expect(slot!.textContent).toContain('Ada');
  });

  it('does not wrap cells in slots without a row-key', async () => {
    const el = await mountTable();
    expect(el.shadowRoot!.querySelector('tbody slot[name^="cell:"]')).toBeNull();
    expect(el.shadowRoot!.querySelector('tbody tr td')?.textContent).toContain('Ada');
  });

  it('projects light-DOM content into a cell slot', async () => {
    const el = await mountWithProps<DsTable<Person>>(
      '<ds-table row-key="id"><span slot="cell:name:1">PROJECTED</span></ds-table>',
      { rows: ROWS, columns: COLUMNS },
    );
    const slot = el.shadowRoot!.querySelector<HTMLSlotElement>('slot[name="cell:name:1"]')!;
    const assigned = slot.assignedNodes({ flatten: true }).map((n) => n.textContent ?? '');
    expect(assigned.join('')).toContain('PROJECTED');
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

  it('omits aria-sort on sortable columns when no sort state matches', async () => {
    const el = await mountTable();
    const headers = el.shadowRoot!.querySelectorAll('thead th');
    expect(headers[0].hasAttribute('aria-sort')).toBe(false);
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
    const content = el.shadowRoot!.querySelector('.cell-content') as HTMLElement;
    expect(content.textContent?.trim()).toBe('');
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
    expect(el.shadowRoot!.querySelector('[role="status"]')?.textContent).toContain('Loading...');
    expect(el.shadowRoot!.querySelector('[part="empty"]')).toBeNull();
  });

  it('includes stacked skeleton styles for narrow containers', () => {
    const css = (DsTable as unknown as { styles: { cssText: string }[] }).styles
      .map(style => style.cssText)
      .join('\n');
    expect(css).toContain('.skeleton-table');
    expect(css).toContain('min-width: 0');
    expect(css).toContain('.cell-label');
    expect(css).toContain('overflow-wrap: anywhere');
    expect(css).toContain('clip-path: inset(50%)');
    expect(css).toContain('box-shadow: var(--ds-shadow-focus)');
  });

  it('draws clickable row focus only from the row action in table layout', () => {
    const css = (DsTable as unknown as { styles: { cssText: string }[] }).styles
      .map(style => style.cssText)
      .join('\n');
    expect(css).toContain('tbody tr.clickable:has(.row-action:focus-visible) td');
    expect(css).toContain('inset 0 2px 0 var(--ds-color-focus)');
    expect(css).toContain('inset 2px 0 0 var(--ds-color-focus)');
  });

  it('rounds the last row edge cells to match the table container', () => {
    const css = (DsTable as unknown as { styles: { cssText: string }[] }).styles
      .map(style => style.cssText)
      .join('\n');
    expect(css).toContain('tbody tr:last-child td:first-child');
    expect(css).toContain('border-bottom-left-radius');
    expect(css).toContain('border-bottom-right-radius');
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

    it('renders a native row action button for keyboard activation', async () => {
      const el = await mountTable({ clickableRows: true });
      const button = el.shadowRoot!.querySelector('tbody tr .row-action') as HTMLButtonElement;
      expect(button.type).toBe('button');
      expect(button.getAttribute('aria-label')).toBe('Activate row 1');
    });

    it('supports custom row action labels', async () => {
      const el = await mountTable({
        clickableRows: true,
        rowActionLabel: row => `Open ${row.name}`,
      });
      const button = el.shadowRoot!.querySelector('tbody tr .row-action') as HTMLButtonElement;
      expect(button.getAttribute('aria-label')).toBe('Open Ada');
    });

    it('fires from the native row action button', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const button = el.shadowRoot!.querySelector('tbody tr .row-action') as HTMLButtonElement;
      button.click();
      expect(events[0]?.detail).toEqual({ row: ROWS[0], index: 0 });
    });

    it('does not fire on row keydown', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
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

    it('does not fire when pointer movement indicates a drag', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new MouseEvent('pointerdown', {
        bubbles: true, composed: true, clientX: 10, clientY: 10,
      }));
      tr.dispatchEvent(new MouseEvent('pointermove', {
        bubbles: true, composed: true, clientX: 18, clientY: 10,
      }));
      tr.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events).toHaveLength(0);
    });

    it('does not fire when text is selected', async () => {
      const el = await mountTable({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      vi.spyOn(window, 'getSelection').mockReturnValue({ isCollapsed: false } as Selection);

      tr.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));

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

    it('keeps clickable rows as native table rows', async () => {
      const el = await mountTable({ clickableRows: true });
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      expect(tr.hasAttribute('role')).toBe(false);
      expect(tr.hasAttribute('tabindex')).toBe(false);
    });
  });
});
