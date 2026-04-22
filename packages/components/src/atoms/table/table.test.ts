import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { html } from 'lit';
import { DsTable } from './table.js';
import './define.js';
import type { TableColumn, TableSortState } from './types.js';

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

async function mount(props: Partial<DsTable<Person>> = {}): Promise<DsTable<Person>> {
  document.body.innerHTML = '<ds-table></ds-table>';
  const el = document.body.firstElementChild as DsTable<Person>;
  Object.assign(el, { rows: ROWS, columns: COLUMNS, ...props });
  await el.updateComplete;
  return el;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('<ds-table>', () => {
  it('renders one row per item with cells from row fields', async () => {
    const el = await mount();
    const rows = el.shadowRoot!.querySelectorAll('tbody tr');
    expect(rows).toHaveLength(2);
    expect(rows[0].textContent).toContain('Ada');
    expect(rows[0].textContent).toContain('100');
  });

  it('applies align class to cells', async () => {
    const el = await mount();
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
    const el = await mount({ columns });
    expect(received).toEqual([{ name: 'Ada', index: 0 }, { name: 'Bob', index: 1 }]);
    expect(el.shadowRoot!.querySelector('em')?.textContent).toBe('ADA');
  });

  it('shows empty slot fallback when rows is empty', async () => {
    const el = await mount({ rows: [] });
    expect(el.shadowRoot!.querySelector('[part="empty"]')?.textContent).toContain('No data');
  });

  it('sets aria-sort from sortState on sortable columns', async () => {
    const sortState: TableSortState = { name: 'name', direction: 'asc' };
    const el = await mount({ sortState });
    const headers = el.shadowRoot!.querySelectorAll('thead th');
    expect(headers[0].getAttribute('aria-sort')).toBe('ascending');
    expect(headers[1].hasAttribute('aria-sort')).toBe(false);
  });

  it('sets aria-sort="none" on sortable columns when no sort state matches', async () => {
    const el = await mount();
    const headers = el.shadowRoot!.querySelectorAll('thead th');
    expect(headers[0].getAttribute('aria-sort')).toBe('none');
  });

  describe('clickable rows', () => {
    it('fires ds-row-click on click when clickable-rows is set', async () => {
      const el = await mount({ clickableRows: true });
      const events: CustomEvent<{ row: Person; index: number }>[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events[0]?.detail.row).toEqual(ROWS[0]);
      expect(events[0]?.detail.index).toBe(0);
    });

    it('does not fire when clickable-rows is unset', async () => {
      const el = await mount({ clickableRows: false });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events).toHaveLength(0);
    });

    it('fires on Enter and Space keydown', async () => {
      const el = await mount({ clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      tr.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true }));
      tr.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true }));
      expect(events).toHaveLength(2);
    });

    it('does not fire when the click target is inside an interactive descendant', async () => {
      const columns: TableColumn<Person>[] = [
        { name: 'name', field: 'name', label: 'Name' },
        {
          name: 'action', field: 'id', label: '',
          render: (row) => html`<button data-id=${row.id}>Edit</button>`,
        },
      ];
      const el = await mount({ columns, clickableRows: true });
      const events: CustomEvent[] = [];
      el.addEventListener('ds-row-click', (e) => events.push(e as CustomEvent));
      const button = el.shadowRoot!.querySelector('button[data-id]') as HTMLButtonElement;
      button.dispatchEvent(new MouseEvent('click', { bubbles: true, composed: true }));
      expect(events).toHaveLength(0);
    });

    it('sets role=button and tabindex=0 on rows when clickable', async () => {
      const el = await mount({ clickableRows: true });
      const tr = el.shadowRoot!.querySelector('tbody tr')!;
      expect(tr.getAttribute('role')).toBe('button');
      expect(tr.getAttribute('tabindex')).toBe('0');
    });
  });
});
