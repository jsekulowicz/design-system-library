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

  it('applies align class to cells', async () => {
    const el = await mountTable();
    const cells = el.shadowRoot!.querySelectorAll('tbody tr:first-child td');
    expect(cells[0].classList.contains('align-left')).toBe(true);
    expect(cells[1].classList.contains('align-right')).toBe(true);
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
