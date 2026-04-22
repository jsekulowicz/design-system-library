import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import type { TableColumn, TableSortDirection, TableSortState } from '@ds/components/table';
import '@ds/components/table/define';
import '@ds/components/badge/define';
import '@ds/components/button/define';
import '@ds/components/text-field/define';

type Person = {
  id: number;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'disabled';
  joined: string;
  salary: number;
};

const PEOPLE: readonly Person[] = [
  { id: 1, name: 'Ada Lovelace', role: 'Engineer', status: 'active', joined: '2021-03-12', salary: 120000 },
  { id: 2, name: 'Alan Turing', role: 'Researcher', status: 'active', joined: '2019-07-01', salary: 135000 },
  { id: 3, name: 'Grace Hopper', role: 'Architect', status: 'pending', joined: '2023-11-15', salary: 140000 },
  { id: 4, name: 'Edsger Dijkstra', role: 'Engineer', status: 'disabled', joined: '2018-02-20', salary: 128000 },
  { id: 5, name: 'Barbara Liskov', role: 'Architect', status: 'active', joined: '2022-05-09', salary: 152000 },
  { id: 6, name: 'Ken Thompson', role: 'Engineer', status: 'active', joined: '2020-01-10', salary: 132000 },
  { id: 7, name: 'Margaret Hamilton', role: 'Researcher', status: 'active', joined: '2017-09-30', salary: 148000 },
  { id: 8, name: 'Donald Knuth', role: 'Architect', status: 'pending', joined: '2024-01-05', salary: 160000 },
];

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

const statusTone = { active: 'success', pending: 'warning', disabled: 'neutral' } as const;

const BASIC_COLUMNS: readonly TableColumn<Person>[] = [
  { name: 'name', field: 'name', label: 'Name' },
  { name: 'role', field: 'role', label: 'Role' },
  { name: 'status', field: 'status', label: 'Status' },
  { name: 'joined', field: 'joined', label: 'Joined' },
];

const RICH_COLUMNS: readonly TableColumn<Person>[] = [
  { name: 'name', field: 'name', label: 'Name', sortable: true },
  { name: 'role', field: 'role', label: 'Role' },
  {
    name: 'status', field: 'status', label: 'Status',
    render: row => html`<ds-badge tone=${statusTone[row.status]}>${row.status}</ds-badge>`,
  },
  { name: 'joined', field: 'joined', label: 'Joined', sortable: true },
  {
    name: 'salary', field: 'salary', label: 'Salary', align: 'right', sortable: true,
    render: row => money.format(row.salary),
  },
];

function sortBy<T extends Record<string, unknown>>(rows: readonly T[], field: string, direction: TableSortDirection): T[] {
  if (!direction) {
    return [...rows];
  }
  const sorted = [...rows].sort((a, b) => {
    const av = a[field];
    const bv = b[field];
    if (typeof av === 'number' && typeof bv === 'number') {
      return av - bv;
    }
    return String(av ?? '').localeCompare(String(bv ?? ''));
  });
  return direction === 'asc' ? sorted : sorted.reverse();
}

const meta: Meta = {
  title: 'Atoms/Table',
  component: 'ds-table',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <ds-table .rows=${PEOPLE.slice(0, 4)} .columns=${BASIC_COLUMNS}></ds-table>
  `,
};

export const WithRenderFunctions: Story = {
  render: () => html`
    <ds-table .rows=${PEOPLE} .columns=${RICH_COLUMNS}></ds-table>
  `,
};

export const Sortable: Story = {
  render: () => {
    let state: TableSortState = { name: 'name', direction: null };
    const handleSort = (field: string) => (event: CustomEvent<{ direction: TableSortDirection }>) => {
      const button = event.target as HTMLElement & { direction: TableSortDirection };
      const table = button.closest('ds-table') as HTMLElement & { rows: readonly Person[]; sortState: TableSortState };
      state = { name: field, direction: event.detail.direction };
      button.direction = event.detail.direction;
      table.rows = sortBy(PEOPLE, field, event.detail.direction);
      table.sortState = state;
    };
    return html`
      <ds-table .rows=${PEOPLE} .columns=${RICH_COLUMNS} .sortState=${state}>
        <ds-table-sort-button slot="header-name" column="Name" @ds-sort=${handleSort('name')}></ds-table-sort-button>
        <ds-table-sort-button slot="header-joined" column="Joined" @ds-sort=${handleSort('joined')}></ds-table-sort-button>
        <ds-table-sort-button slot="header-salary" column="Salary" @ds-sort=${handleSort('salary')}></ds-table-sort-button>
      </ds-table>
    `;
  },
};

export const ClickableRows: Story = {
  render: () => html`
    <div>
      <p id="clickLog" style="margin: 0 0 var(--ds-space-3); color: var(--ds-color-fg-muted); font-family: var(--ds-font-body);">
        Click or press Enter on a row.
      </p>
      <ds-table
        clickable-rows
        .rows=${PEOPLE.slice(0, 5)}
        .columns=${[
          ...RICH_COLUMNS,
          {
            name: 'action', field: 'id', label: '',
            render: (row: Person) => html`<ds-button size="sm" variant="ghost" @ds-click=${(e: Event) => e.stopPropagation()}>Edit ${row.name.split(' ')[0]}</ds-button>`,
          },
        ]}
        @ds-row-click=${(e: CustomEvent<{ row: Person }>) => {
          const log = document.getElementById('clickLog');
          if (log) {
            log.textContent = `Clicked row: ${e.detail.row.name}`;
          }
        }}
      ></ds-table>
    </div>
  `,
};

export const EmptyState: Story = {
  render: () => html`
    <ds-table .rows=${[]} .columns=${BASIC_COLUMNS}>
      <div slot="empty">
        <p style="margin: 0 0 var(--ds-space-3);">No people yet.</p>
        <ds-button size="sm">Invite someone</ds-button>
      </div>
    </ds-table>
  `,
};

export const WithCaptionAndToolbar: Story = {
  render: () => html`
    <ds-table .rows=${PEOPLE.slice(0, 5)} .columns=${RICH_COLUMNS}>
      <span slot="caption">Team roster — Q2 snapshot</span>
      <div slot="toolbar" style="display: flex; gap: var(--ds-space-2); align-items: flex-end;">
        <ds-text-field label="Filter by name" size="sm"></ds-text-field>
        <ds-button variant="secondary" size="sm">Export CSV</ds-button>
      </div>
    </ds-table>
  `,
};

export const Paginated: Story = {
  render: () => {
    let page = 1;
    let pageSize = 3;
    const render = (table: HTMLElement & { rows: readonly Person[] }, pagination: HTMLElement & { page: number; pageSize: number }) => {
      const start = (page - 1) * pageSize;
      table.rows = PEOPLE.slice(start, start + pageSize);
      pagination.page = page;
      pagination.pageSize = pageSize;
    };
    return html`
      <ds-table
        id="paginatedTable"
        .rows=${PEOPLE.slice(0, 3)}
        .columns=${RICH_COLUMNS}
      >
        <ds-table-pagination
          slot="footer"
          page=${page}
          page-size=${pageSize}
          total=${PEOPLE.length}
          .pageSizeOptions=${[3, 5, 8]}
          @ds-page-change=${(e: CustomEvent<{ page: number }>) => {
            page = e.detail.page;
            const table = document.getElementById('paginatedTable') as HTMLElement & { rows: readonly Person[] };
            const pagination = (e.target as HTMLElement) as HTMLElement & { page: number; pageSize: number };
            render(table, pagination);
          }}
          @ds-page-size-change=${(e: CustomEvent<{ pageSize: number; page: number }>) => {
            pageSize = e.detail.pageSize;
            page = e.detail.page;
            const table = document.getElementById('paginatedTable') as HTMLElement & { rows: readonly Person[] };
            const pagination = (e.target as HTMLElement) as HTMLElement & { page: number; pageSize: number };
            render(table, pagination);
          }}
        ></ds-table-pagination>
      </ds-table>
    `;
  },
};

export const PaginatedCompact: Story = {
  render: () => html`
    <ds-table-pagination
      hide-page-numbers
      page="2"
      page-size="10"
      total="42"
      @ds-page-change=${(e: CustomEvent<{ page: number }>) => {
        (e.target as HTMLElement & { page: number }).page = e.detail.page;
      }}
    ></ds-table-pagination>
  `,
};

export const StandalonePagination: Story = {
  render: () => html`
    <ds-table-pagination
      page="4"
      page-size="10"
      total="126"
      .pageSizeOptions=${[10, 25, 50]}
      @ds-page-change=${(e: CustomEvent<{ page: number }>) => {
        (e.target as HTMLElement & { page: number }).page = e.detail.page;
      }}
      @ds-page-size-change=${(e: CustomEvent<{ pageSize: number; page: number }>) => {
        const el = e.target as HTMLElement & { pageSize: number; page: number };
        el.pageSize = e.detail.pageSize;
        el.page = e.detail.page;
      }}
    ></ds-table-pagination>
  `,
};
