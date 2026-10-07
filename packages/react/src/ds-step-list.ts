import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsStepList } from '@jsekulowicz/ds-components/step-list';
import '@jsekulowicz/ds-components/step-list/define';

export const StepList = createComponent({
  tagName: 'ds-step-list',
  elementClass: DsStepList,
  react: React,
  events: {
    'onDsStepSelect': 'ds-step-select' as EventName<CustomEvent>,
  },
  displayName: 'StepList',
});
