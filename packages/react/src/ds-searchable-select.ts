import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsSearchableSelect } from '@ds/components/searchable-select';
import '@ds/components/searchable-select/define';

export const SearchableSelect = createComponent({
  tagName: 'ds-searchable-select',
  elementClass: DsSearchableSelect,
  react: React,
  events: {
    'onDsSearch': 'ds-search' as EventName<CustomEvent>,
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'SearchableSelect',
});
