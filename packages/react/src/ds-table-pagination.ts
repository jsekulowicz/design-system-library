import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTablePagination } from '@jsekulowicz/ds-components/table';
import '@jsekulowicz/ds-components/table/define';

export const TablePagination = createComponent({
  tagName: 'ds-table-pagination',
  elementClass: DsTablePagination,
  react: React,
  events: {
    'onDsPageChange': 'ds-page-change' as EventName<CustomEvent>,
    'onDsPageSizeChange': 'ds-page-size-change' as EventName<CustomEvent>,
  },
  displayName: 'TablePagination',
});
