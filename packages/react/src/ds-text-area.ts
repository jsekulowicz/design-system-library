import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTextArea } from '@jsekulowicz/ds-components/text-area';
import '@jsekulowicz/ds-components/text-area/define';

export const TextArea = createComponent({
  tagName: 'ds-text-area',
  elementClass: DsTextArea,
  react: React,
  events: {
    'onDsInput': 'ds-input' as EventName<CustomEvent>,
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'TextArea',
});
