import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsRadio } from '@jsekulowicz/ds-components/radio';
import type { ValueChangeDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/radio/define';

export const Radio = createComponent({
  tagName: 'ds-radio',
  elementClass: DsRadio,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent<ValueChangeDetail>>,
  },
  displayName: 'Radio',
});
