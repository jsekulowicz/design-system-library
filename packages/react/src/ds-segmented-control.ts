import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsSegmentedControl } from '@jsekulowicz/ds-components/segmented-control';
import '@jsekulowicz/ds-components/segmented-control/define';

export const SegmentedControl = createComponent({
  tagName: 'ds-segmented-control',
  elementClass: DsSegmentedControl,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'SegmentedControl',
});
