import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTable } from '@jsekulowicz/ds-components/table';
import type { TableRowClickDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/table/define';

export const Table = createComponent({
  tagName: 'ds-table',
  elementClass: DsTable,
  react: React,
  events: {
    'onDsRowClick': 'ds-row-click' as EventName<CustomEvent<TableRowClickDetail>>,
  },
  displayName: 'Table',
});
