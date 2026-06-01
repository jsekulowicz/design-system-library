import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsDrawer } from '@jsekulowicz/ds-components/drawer';
import '@jsekulowicz/ds-components/drawer/define';

export const Drawer = createComponent({
  tagName: 'ds-drawer',
  elementClass: DsDrawer,
  react: React,
  events: {
    'onDsOpen': 'ds-open' as EventName<CustomEvent>,
    'onDsClose': 'ds-close' as EventName<CustomEvent>,
    'onDsCancel': 'ds-cancel' as EventName<CustomEvent>,
  },
  displayName: 'Drawer',
});
