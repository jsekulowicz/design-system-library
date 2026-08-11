import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsPopoverButton } from '@jsekulowicz/ds-components/popover-button';
import '@jsekulowicz/ds-components/popover-button/define';

export const PopoverButton = createComponent({
  tagName: 'ds-popover-button',
  elementClass: DsPopoverButton,
  react: React,
  events: {
    'onDsOpen': 'ds-open' as EventName<CustomEvent>,
    'onDsClose': 'ds-close' as EventName<CustomEvent>,
  },
  displayName: 'PopoverButton',
});
