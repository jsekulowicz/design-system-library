import { describe, it, expect, beforeAll, beforeEach, afterEach, vi } from 'vitest';
import { html } from 'lit';
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
      .map((style) => style.cssText)
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
      .map((style) => style.cssText)
      .join('\n');
    expect(css).toContain('tbody tr.clickable:has(.row-action:focus-visible) td');
    expect(css).toContain('inset 0 2px 0 var(--ds-color-focus)');
    expect(css).toContain('inset 2px 0 0 var(--ds-color-focus)');
  });

  it('rounds the last row edge cells to match the table container', () => {
    const css = (DsTable as unknown as { styles: { cssText: string }[] }).styles
      .map((style) => style.cssText)
      .join('\n');
    expect(css).toContain('tbody tr:last-child td:first-child');
    expect(css).toContain('border-bottom-left-radius');
    expect(css).toContain('border-bottom-right-radius');
  });

  it('shows a loading overlay over initialized data', async () => {
    const el = await mountTable({ loading: true, loadingLabel: 'Refreshing people...' });
    const table = el.shadowRoot!.querySelector('table') as HTMLTableElement;
    const loading = el.shadowRoot!.querySelector('[part="loading"]') as HTMLElement;
    expect(table.getAttribute('aria-busy')).toBe('true');
    expect(el.hasAttribute('loading')).toBe(false);
    expect(loading.getAttribute('role')).toBe('status');
    expect(loading.textContent).toContain('Refreshing people...');
  });

  it('treats loading="false" as false for string-based integrations', async () => {
    const el = await mountWithProps<DsTable<Person>>('<ds-table loading="false"></ds-table>', {
      rows: ROWS,
      columns: COLUMNS,
    });
    expect(el.loading).toBe(false);
    expect(el.shadowRoot!.querySelector('[part="loading"]')).toBeNull();
  });

  it('renders slotted loading content', async () => {
    const el = await mountWithProps<DsTable<Person>>('<ds-table><span slot="loading">Chargement...</span></ds-table>', {
      rows: ROWS,
      columns: COLUMNS,
      loading: true,
    });
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
        rowActionLabel: (row) => `Open ${row.name}`,
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
          name: 'action',
          field: 'id',
          label: '',
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
      tr.dispatchEvent(
        new MouseEvent('pointerdown', {
          bubbles: true,
          composed: true,
          clientX: 10,
          clientY: 10,
        }),
      );
      tr.dispatchEvent(
        new MouseEvent('pointermove', {
          bubbles: true,
          composed: true,
          clientX: 18,
          clientY: 10,
        }),
      );
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
          name: 'action',
          field: 'id',
          label: '',
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
          name: 'meta',
          field: 'id',
          label: '',
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
