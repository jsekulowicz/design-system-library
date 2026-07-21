import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsPieChart } from '@jsekulowicz/ds-components/pie-chart';
import '@jsekulowicz/ds-components/pie-chart/define';

export const PieChart = createComponent({
  tagName: 'ds-pie-chart',
  elementClass: DsPieChart,
  react: React,
  events: {
    'onDsSliceFocus': 'ds-slice-focus' as EventName<CustomEvent>,
    'onDsSliceSelect': 'ds-slice-select' as EventName<CustomEvent>,
  },
  displayName: 'PieChart',
});
