import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsRadioGroup } from '@ds/components/radio-group';
import '@ds/components/radio-group/define';

export const RadioGroup = createComponent({
  tagName: 'ds-radio-group',
  elementClass: DsRadioGroup,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'RadioGroup',
});
