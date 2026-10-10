import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsSelect } from '@jsekulowicz/ds-components/select';
import type { OverflowClickDetail, SelectionChangeDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/select/define';

export const Select = createComponent({
  tagName: 'ds-select',
  elementClass: DsSelect,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent<SelectionChangeDetail>>,
    'onDsScrollEnd': 'ds-scroll-end' as EventName<CustomEvent>,
    'onDsOverflowClick': 'ds-overflow-click' as EventName<CustomEvent<OverflowClickDetail>>,
  },
  displayName: 'Select',
});
