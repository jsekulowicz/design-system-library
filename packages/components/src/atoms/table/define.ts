import { DsTable } from './table.js';
import { DsTableSortButton } from './table-sort-button.js';
import { DsTablePagination } from './table-pagination.js';

if (!customElements.get('ds-table')) {
  customElements.define('ds-table', DsTable);
}
if (!customElements.get('ds-table-sort-button')) {
  customElements.define('ds-table-sort-button', DsTableSortButton);
}
if (!customElements.get('ds-table-pagination')) {
  customElements.define('ds-table-pagination', DsTablePagination);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-table': DsTable;
    'ds-table-sort-button': DsTableSortButton;
    'ds-table-pagination': DsTablePagination;
  }
}
