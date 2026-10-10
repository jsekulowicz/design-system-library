import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTextField } from '@jsekulowicz/ds-components/text-field';
import type { ValueChangeDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/text-field/define';

export const TextField = createComponent({
  tagName: 'ds-text-field',
  elementClass: DsTextField,
  react: React,
  events: {
    'onDsInput': 'ds-input' as EventName<CustomEvent<ValueChangeDetail>>,
    'onDsChange': 'ds-change' as EventName<CustomEvent<ValueChangeDetail>>,
  },
  displayName: 'TextField',
});
