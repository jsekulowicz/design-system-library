import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsHeatmapCalendar } from '@jsekulowicz/ds-components/heatmap-calendar';
import type { HeatmapFocusDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/heatmap-calendar/define';

export const HeatmapCalendar = createComponent({
  tagName: 'ds-heatmap-calendar',
  elementClass: DsHeatmapCalendar,
  react: React,
  events: {
    'onDsHeatmapFocus': 'ds-heatmap-focus' as EventName<CustomEvent<HeatmapFocusDetail>>,
  },
  displayName: 'HeatmapCalendar',
});
