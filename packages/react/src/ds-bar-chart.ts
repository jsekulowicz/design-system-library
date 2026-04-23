import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsBarChart } from '@ds/components/bar-chart';
import '@ds/components/bar-chart/define';

export const BarChart = createComponent({
  tagName: 'ds-bar-chart',
  elementClass: DsBarChart,
  react: React,
  events: {
    'onDsBarFocus': 'ds-bar-focus' as EventName<CustomEvent>,
  },
  displayName: 'BarChart',
});
