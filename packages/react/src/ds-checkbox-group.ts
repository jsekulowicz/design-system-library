import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsCheckboxGroup } from '@ds/components/checkbox-group';
import '@ds/components/checkbox-group/define';

export const CheckboxGroup = createComponent({
  tagName: 'ds-checkbox-group',
  elementClass: DsCheckboxGroup,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'CheckboxGroup',
});
