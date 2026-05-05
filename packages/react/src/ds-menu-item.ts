import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsMenuItem } from '@jsekulowicz/ds-components/menu';
import '@jsekulowicz/ds-components/menu/define';

export const MenuItem = createComponent({
  tagName: 'ds-menu-item',
  elementClass: DsMenuItem,
  react: React,
  events: {
    'onDsActivate': 'ds-activate' as EventName<CustomEvent>,
  },
  displayName: 'MenuItem',
});
