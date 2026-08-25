import { defineCustomElement } from '../../registration.js';
import { DsTable } from './table.js';
import { DsTableSortButton } from './table-sort-button.js';
import { DsTablePagination } from './table-pagination.js';
import '../../feedback/skeleton/define.js';

defineCustomElement('ds-table', DsTable);
defineCustomElement('ds-table-sort-button', DsTableSortButton);
defineCustomElement('ds-table-pagination', DsTablePagination);

declare global {
  interface HTMLElementTagNameMap {
    'ds-table': DsTable;
    'ds-table-sort-button': DsTableSortButton;
    'ds-table-pagination': DsTablePagination;
  }
}
