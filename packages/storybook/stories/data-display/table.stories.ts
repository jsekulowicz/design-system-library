import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TableColumn, TableSortDirection, TableSortState } from '@jsekulowicz/ds-components/table';
import '@jsekulowicz/ds-components/table/define';
import '@jsekulowicz/ds-components/badge/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/text-field/define';

interface Person {
  [key: string]: unknown;
  id: number;
  name: string;
  role: string;
  status: 'active' | 'pending' | 'disabled';
  joined: string;
  salary: number;
}

type SortableStoryTable = HTMLElement & {
  rows: readonly Person[];
  sortState: TableSortState;
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
    name: 'status',
    field: 'status',
    label: 'Status',
    render: (row) => html`<ds-badge tone=${statusTone[row.status]}>${row.status}</ds-badge>`,
  },
  { name: 'joined', field: 'joined', label: 'Joined', sortable: true },
  {
    name: 'salary',
    field: 'salary',
    label: 'Salary',
    align: 'right',
    sortable: true,
    render: (row) => money.format(row.salary),
  },
];

const OFFICES = ['Remote', 'Berlin', 'New York', 'Tokyo'];
const MANAGERS = ['G. Hopper', 'A. Turing', 'B. Liskov'];

// Enough columns to overflow a full-width desktop container so the pinned
// region has something to scroll under.
const WIDE_COLUMNS: readonly TableColumn<Person>[] = [
  { name: 'name', field: 'name', label: 'Name', width: '12rem' },
  { name: 'role', field: 'role', label: 'Role', width: '11rem' },
  {
    name: 'status',
    field: 'status',
    label: 'Status',
    width: '9rem',
    render: (row) => html`<ds-badge tone=${statusTone[row.status]}>${row.status}</ds-badge>`,
  },
  {
    name: 'email',
    field: 'name',
    label: 'Email',
    width: '17rem',
    render: (row) => `${(row.name.split(' ')[0] ?? row.name).toLowerCase()}@example.com`,
  },
  { name: 'joined', field: 'joined', label: 'Joined', width: '10rem' },
  {
    name: 'salary',
    field: 'salary',
    label: 'Salary',
    align: 'right',
    width: '10rem',
    render: (row) => money.format(row.salary),
  },
  { name: 'level', field: 'id', label: 'Level', width: '8rem', render: (row) => `L${3 + (row.id % 5)}` },
  {
    name: 'tenure',
    field: 'joined',
    label: 'Tenure',
    width: '10rem',
    render: (row) => `${2026 - Number(row.joined.slice(0, 4))} yrs`,
  },
  {
    name: 'office',
    field: 'id',
    label: 'Office',
    width: '12rem',
    render: (row) => OFFICES[row.id % OFFICES.length] ?? '',
  },
  {
    name: 'manager',
    field: 'id',
    label: 'Manager',
    width: '14rem',
    render: (row) => MANAGERS[row.id % MANAGERS.length] ?? '',
  },
  {
    name: 'reviewDue',
    field: 'joined',
    label: 'Review due',
    width: '12rem',
    render: (row) => `2026-Q${1 + (row.id % 4)}`,
  },
];

interface LongContentRow {
  [key: string]: unknown;
  id: number;
  metricName: string;
  owner: string;
  lastUpdate: string;
}

const LONG_CONTENT_ROWS: readonly LongContentRow[] = [
  {
    id: 1,
    metricName: 'north-america-enterprise-account-renewal-risk-score-with-exception-review',
    owner: 'Data Platform Reliability and Governance',
    lastUpdate: 'Awaiting final approval from regional compliance and operations leadership',
  },
  {
    id: 2,
    metricName: 'Customer onboarding path with a very long readable description',
    owner: 'Customer Experience',
    lastUpdate: 'Backlog grooming completed; implementation can start after design review',
  },
];

const LONG_CONTENT_COLUMNS: readonly TableColumn<LongContentRow>[] = [
  { name: 'metricName', field: 'metricName', label: 'Long metric or record name' },
  { name: 'owner', field: 'owner', label: 'Responsible team or business capability' },
  { name: 'lastUpdate', field: 'lastUpdate', label: 'Latest status update' },
];

function sortBy<T extends Record<string, unknown>>(
  rows: readonly T[],
  field: string,
  direction: TableSortDirection,
): T[] {
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
  title: 'Data Display/Table',
  component: 'ds-table',
  argTypes: {
    rows: { control: 'object' },
    columns: { control: 'object' },
    pinnedColumns: { control: 'object' },
    sortState: { control: 'object' },
    rowActionLabel: { control: false },
    clickableRows: { control: 'boolean' },
    loading: { control: 'boolean' },
    skeletonRows: { control: { type: 'number', min: 1 } },
    skeletonColumns: { control: { type: 'number', min: 1 } },
    rowKey: { control: 'text' },
    responsive: {
      control: { type: 'inline-radio' },
      options: ['stack', 'scroll'],
    },
    scrollBody: { control: 'boolean' },
  },
  args: {
    rows: PEOPLE.slice(0, 4),
    columns: BASIC_COLUMNS,
    pinnedColumns: [],
    sortState: null,
    clickableRows: false,
    loading: false,
    skeletonRows: 5,
    skeletonColumns: 4,
    rowKey: '',
    responsive: 'stack',
    scrollBody: false,
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  parameters: {
    docs: {
      source: {
        language: 'ts',
        code: `\
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import '@jsekulowicz/ds-components/table/define';

const columns: TableColumn<Person>[] = [
  { name: 'name',   field: 'name',   label: 'Name' },
  { name: 'role',   field: 'role',   label: 'Role' },
  { name: 'status', field: 'status', label: 'Status' },
  { name: 'joined', field: 'joined', label: 'Joined' },
];

// rows and columns must be set as JS properties, not HTML attributes
const table = document.querySelector('ds-table');
table.columns = columns;
table.rows = rows;`,
      },
    },
  },
  render: (args) => html`
    <ds-table
      .rows=${args['rows']}
      .columns=${args['columns']}
      .pinnedColumns=${args['pinnedColumns']}
      .sortState=${args['sortState']}
      .rowActionLabel=${args['rowActionLabel']}
      .clickableRows=${args['clickableRows']}
      .loading=${args['loading']}
      .skeletonRows=${args['skeletonRows']}
      .skeletonColumns=${args['skeletonColumns']}
      .rowKey=${args['rowKey']}
      .responsive=${args['responsive']}
      .scrollBody=${args['scrollBody']}
    ></ds-table>
  `,
};

export const WithRenderFunctions: Story = {
  parameters: {
    docs: {
      source: {
        language: 'ts',
        code: `\
import { html } from 'lit';
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import '@jsekulowicz/ds-components/table/define';
import '@jsekulowicz/ds-components/badge/define';

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
const statusTone = { active: 'success', pending: 'warning', disabled: 'neutral' } as const;

const columns: TableColumn<Person>[] = [
  { name: 'name',   field: 'name',   label: 'Name',   sortable: true },
  { name: 'role',   field: 'role',   label: 'Role' },
  {
    name: 'status', field: 'status', label: 'Status',
    render: row => html\`<ds-badge tone=\${statusTone[row.status]}>\${row.status}</ds-badge>\`,
  },
  { name: 'joined', field: 'joined', label: 'Joined',  sortable: true },
  {
    name: 'salary', field: 'salary', label: 'Salary',  align: 'right', sortable: true,
    render: row => money.format(row.salary),
  },
];

// rows and columns must be set as JS properties, not HTML attributes
const table = document.querySelector('ds-table');
table.columns = columns;
table.rows = rows;`,
      },
    },
  },
  render: () => html` <ds-table .rows=${PEOPLE} .columns=${RICH_COLUMNS}></ds-table> `,
};

export const SlottedCells: Story = {
  name: 'Per-cell slots',
  parameters: {
    docs: {
      description: {
        story:
          'With `row-key` set, project host/framework content into an individual cell via the `cell:{column}:{rowKey}` slot. Cells with nothing projected fall back to the column `render`/`field`.',
      },
    },
  },
  render: () => html`
    <ds-table .rows=${PEOPLE} .columns=${BASIC_COLUMNS} row-key="id">
      ${PEOPLE.map(
        (person) =>
          html`<ds-badge slot="cell:status:${person.id}" tone=${statusTone[person.status]}>${person.status}</ds-badge>`,
      )}
    </ds-table>
  `,
};

export const ScrollBodyWithPagination: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'With the `scroll-body` attribute, only the body scrolls - the header row and the ' +
          'pagination footer stay pinned. The scrollbar is hidden and overflow is signalled by ' +
          'top/bottom fades (the top fade is offset below the header). The host needs a bounded ' +
          'height; here the table fills a 13rem flex column.',
      },
    },
  },
  render: () => {
    let page = 1;
    let pageSize = 5;
    const sync = () => {
      const table = document.getElementById('scrollBodyTable') as HTMLElement & { rows: readonly Person[] };
      const start = (page - 1) * pageSize;
      table.rows = PEOPLE.slice(start, start + pageSize);
    };
    return html`
      <div style="height: 13rem; display: flex; flex-direction: column;">
        <ds-table
          scroll-body
          id="scrollBodyTable"
          style="flex: 1; min-height: 0;"
          .rows=${PEOPLE.slice(0, pageSize)}
          .columns=${RICH_COLUMNS}
        >
          <ds-table-pagination
            slot="footer"
            page=${page}
            page-size=${pageSize}
            total=${PEOPLE.length}
            .pageSizeOptions=${[5, 8]}
            @ds-page-change=${(e: CustomEvent<{ page: number }>) => {
              page = e.detail.page;
              sync();
            }}
            @ds-page-size-change=${(e: CustomEvent<{ pageSize: number; page: number }>) => {
              pageSize = e.detail.pageSize;
              page = e.detail.page;
              sync();
            }}
          ></ds-table-pagination>
        </ds-table>
      </div>
    `;
  },
};

export const PinnedColumns: Story = {
  name: 'Pinned columns',
  parameters: {
    docs: {
      description: {
        story:
          'Pass `pinnedColumns` (an array of column `name`s) to freeze columns into a contiguous ' +
          'left region while the rest scrolls horizontally. Any column is eligible - here `status` ' +
          '(the 3rd column) is pinned alongside `name` without pinning `role` in between; the pinned ' +
          'columns keep their original relative order. A separator marks the edge and a shadow fades ' +
          'in once the body is scrolled sideways.',
      },
    },
  },
  render: () => html`
    <style>
      .pin-demo ds-table::part(table) {
        min-width: 125rem;
      }
    </style>
    <div class="pin-demo">
      <ds-table responsive="scroll" .rows=${PEOPLE} .columns=${WIDE_COLUMNS} .pinnedColumns=${['name', 'status']}>
        <span slot="caption">Scroll sideways - Name and Status stay pinned</span>
      </ds-table>
    </div>
  `,
};

export const PinnedScrollBody: Story = {
  name: 'Pinned columns (scroll-body)',
  parameters: {
    docs: {
      description: {
        story:
          'Pinning combines with `scroll-body`: the header pins vertically while the pinned columns ' +
          'pin horizontally, so the pinned header corner stays fixed on both axes.',
      },
    },
  },
  render: () => html`
    <style>
      .pin-demo-sb ds-table::part(table) {
        min-width: 125rem;
      }
    </style>
    <div class="pin-demo-sb" style="height: 16rem; display: flex; flex-direction: column;">
      <ds-table
        scroll-body
        responsive="scroll"
        style="flex: 1; min-height: 0;"
        .rows=${PEOPLE}
        .columns=${WIDE_COLUMNS}
        .pinnedColumns=${['name']}
      ></ds-table>
    </div>
  `,
};

export const ResponsiveStack: Story = {
  render: () => html`
    <div style="max-width: 24rem;">
      <ds-table .rows=${PEOPLE.slice(0, 3)} .columns=${RICH_COLUMNS}>
        <span slot="caption">Narrow container using the default stacked layout</span>
      </ds-table>
    </div>
  `,
};

export const ResponsiveScroll: Story = {
  render: () => html`
    <div style="max-width: 24rem;">
      <ds-table responsive="scroll" .rows=${PEOPLE.slice(0, 3)} .columns=${RICH_COLUMNS}>
        <span slot="caption">Narrow container preserving horizontal scroll</span>
      </ds-table>
    </div>
  `,
};

export const ResponsiveLongContent: Story = {
  render: () => html`
    <div style="max-width: 24rem;">
      <ds-table .rows=${LONG_CONTENT_ROWS} .columns=${LONG_CONTENT_COLUMNS}>
        <span slot="caption">Long labels and values wrap in stacked rows</span>
      </ds-table>
    </div>
  `,
};

export const Sortable: Story = {
  render: () => {
    let state: TableSortState = { name: 'name', direction: null };
    const handleSort = (field: string) => (event: CustomEvent<{ direction: TableSortDirection }>) => {
      const button = event.target as HTMLElement & { direction: TableSortDirection };
      const table = button.closest('ds-table') as unknown as SortableStoryTable;
      state = { name: field, direction: event.detail.direction };
      button.direction = event.detail.direction;
      table.rows = sortBy(PEOPLE, field, event.detail.direction);
      table.sortState = state;
    };
    return html`
      <ds-table .rows=${PEOPLE} .columns=${RICH_COLUMNS} .sortState=${state}>
        <ds-table-sort-button slot="header-name" column="Name" @ds-sort=${handleSort('name')}
          >Name</ds-table-sort-button
        >
        <ds-table-sort-button slot="header-joined" column="Joined" @ds-sort=${handleSort('joined')}
          >Joined</ds-table-sort-button
        >
        <ds-table-sort-button slot="header-salary" column="Salary" @ds-sort=${handleSort('salary')}
          >Salary</ds-table-sort-button
        >
      </ds-table>
    `;
  },
};

export const ClickableRows: Story = {
  render: () => html`
    <div>
      <p
        id="clickLog"
        style="margin: 0 0 var(--ds-space-3); color: var(--ds-color-fg-muted); font-family: var(--ds-font-body);"
      >
        Click a row, or tab to its row action and press Enter.
      </p>
      <ds-table
        clickable-rows
        .rows=${PEOPLE.slice(0, 5)}
        .rowActionLabel=${(row: Person) => `Open ${row.name}`}
        .columns=${[
          ...RICH_COLUMNS,
          {
            name: 'action',
            field: 'id',
            label: '',
            render: (row: Person) =>
              html`<ds-button size="sm" variant="ghost">Edit ${row.name.split(' ')[0]}</ds-button>`,
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
      <span slot="caption">Team roster - Q2 snapshot</span>
      <div slot="toolbar" style="display: flex; gap: var(--ds-space-2); align-items: flex-end;">
        <ds-text-field label="Filter by name" size="sm"></ds-text-field>
        <ds-button variant="secondary" size="sm">Export CSV</ds-button>
      </div>
    </ds-table>
  `,
};

export const Loading: Story = {
  render: () => html`
    <ds-table .loading=${true} .rows=${PEOPLE.slice(0, 5)} .columns=${RICH_COLUMNS}>
      <span slot="caption">Refreshing team roster</span>
      <span slot="loading">Refreshing...</span>
    </ds-table>
  `,
};

export const InitialLoading: Story = {
  render: () => html` <ds-table .loading=${true} .rows=${[]} .columns=${RICH_COLUMNS}></ds-table> `,
};

export const UninitializedSkeleton: Story = {
  render: () => html` <ds-table skeleton-rows="5" skeleton-columns="4"></ds-table> `,
};

export const ResponsiveSkeleton: Story = {
  render: () => html`
    <div style="max-width: 24rem;">
      <ds-table skeleton-rows="4" skeleton-columns="4"></ds-table>
    </div>
  `,
};

export const Paginated: Story = {
  render: () => {
    let page = 1;
    let pageSize = 3;
    const render = (
      table: HTMLElement & { rows: readonly Person[] },
      pagination: HTMLElement & { page: number; pageSize: number },
    ) => {
      const start = (page - 1) * pageSize;
      table.rows = PEOPLE.slice(start, start + pageSize);
      pagination.page = page;
      pagination.pageSize = pageSize;
    };
    return html`
      <ds-table id="paginatedTable" .rows=${PEOPLE.slice(0, 3)} .columns=${RICH_COLUMNS}>
        <ds-table-pagination
          slot="footer"
          page=${page}
          page-size=${pageSize}
          total=${PEOPLE.length}
          .pageSizeOptions=${[3, 5, 8]}
          @ds-page-change=${(e: CustomEvent<{ page: number }>) => {
            page = e.detail.page;
            const table = document.getElementById('paginatedTable') as HTMLElement & { rows: readonly Person[] };
            const pagination = e.target as HTMLElement as HTMLElement & { page: number; pageSize: number };
            render(table, pagination);
          }}
          @ds-page-size-change=${(e: CustomEvent<{ pageSize: number; page: number }>) => {
            pageSize = e.detail.pageSize;
            page = e.detail.page;
            const table = document.getElementById('paginatedTable') as HTMLElement & { rows: readonly Person[] };
            const pagination = e.target as HTMLElement as HTMLElement & { page: number; pageSize: number };
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
