import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsMenu } from '@ds/components/menu';
import '@ds/components/menu/define';

export const Menu = createComponent({
  tagName: 'ds-menu',
  elementClass: DsMenu,
  react: React,
  events: {
    'onDsSelect': 'ds-select' as EventName<CustomEvent>,
  },
  displayName: 'Menu',
});
