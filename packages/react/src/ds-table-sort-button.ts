import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTableSortButton } from '@ds/components/table';
import '@ds/components/table/define';

export const TableSortButton = createComponent({
  tagName: 'ds-table-sort-button',
  elementClass: DsTableSortButton,
  react: React,
  events: {
    'onDsSort': 'ds-sort' as EventName<CustomEvent>,
  },
  displayName: 'TableSortButton',
});
