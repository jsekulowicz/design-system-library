import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsCheckbox } from '@jsekulowicz/ds-components/checkbox';
import type { CheckedChangeDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/checkbox/define';

export const Checkbox = createComponent({
  tagName: 'ds-checkbox',
  elementClass: DsCheckbox,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent<CheckedChangeDetail>>,
  },
  displayName: 'Checkbox',
});
