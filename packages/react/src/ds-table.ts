import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTable } from '@ds/components/table';
import '@ds/components/table/define';

export const Table = createComponent({
  tagName: 'ds-table',
  elementClass: DsTable,
  react: React,
  events: {
    'onDsRowClick': 'ds-row-click' as EventName<CustomEvent>,
  },
  displayName: 'Table',
});
