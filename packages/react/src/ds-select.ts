import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsSelect } from '@jsekulowicz/ds-components/select';
import '@jsekulowicz/ds-components/select/define';

export const Select = createComponent({
  tagName: 'ds-select',
  elementClass: DsSelect,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
    'onDsScrollEnd': 'ds-scroll-end' as EventName<CustomEvent>,
  },
  displayName: 'Select',
});
