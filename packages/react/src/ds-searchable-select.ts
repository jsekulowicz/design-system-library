import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsSearchableSelect } from '@jsekulowicz/ds-components/searchable-select';
import type { OverflowClickDetail, SearchDetail, SelectionChangeDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/searchable-select/define';

export const SearchableSelect = createComponent({
  tagName: 'ds-searchable-select',
  elementClass: DsSearchableSelect,
  react: React,
  events: {
    'onDsSearch': 'ds-search' as EventName<CustomEvent<SearchDetail>>,
    'onDsChange': 'ds-change' as EventName<CustomEvent<SelectionChangeDetail>>,
    'onDsScrollEnd': 'ds-scroll-end' as EventName<CustomEvent>,
    'onDsOverflowClick': 'ds-overflow-click' as EventName<CustomEvent<OverflowClickDetail>>,
  },
  displayName: 'SearchableSelect',
});
