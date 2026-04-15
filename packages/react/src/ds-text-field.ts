import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTextField } from '@ds/components/text-field';
import '@ds/components/text-field/define';

export const TextField = createComponent({
  tagName: 'ds-text-field',
  elementClass: DsTextField,
  react: React,
  events: {
    'onDsInput': 'ds-input' as EventName<CustomEvent>,
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'TextField',
});
