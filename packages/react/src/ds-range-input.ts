import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsRangeInput } from '@jsekulowicz/ds-components/range-input';
import type { ValueChangeDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/range-input/define';

export const RangeInput = createComponent({
  tagName: 'ds-range-input',
  elementClass: DsRangeInput,
  react: React,
  events: {
    'onDsInput': 'ds-input' as EventName<CustomEvent<ValueChangeDetail<number>>>,
    'onDsChange': 'ds-change' as EventName<CustomEvent<ValueChangeDetail<number>>>,
  },
  displayName: 'RangeInput',
});
