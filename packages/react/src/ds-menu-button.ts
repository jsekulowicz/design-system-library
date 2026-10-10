import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsMenuButton } from '@jsekulowicz/ds-components/menu-button';
import type { ActivateDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/menu-button/define';

export const MenuButton = createComponent({
  tagName: 'ds-menu-button',
  elementClass: DsMenuButton,
  react: React,
  events: {
    'onDsSelect': 'ds-select' as EventName<CustomEvent<ActivateDetail>>,
    'onDsOpen': 'ds-open' as EventName<CustomEvent>,
    'onDsClose': 'ds-close' as EventName<CustomEvent>,
  },
  displayName: 'MenuButton',
});
