import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsRadio } from '@ds/components/radio';
import '@ds/components/radio/define';

export const Radio = createComponent({
  tagName: 'ds-radio',
  elementClass: DsRadio,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'Radio',
});
