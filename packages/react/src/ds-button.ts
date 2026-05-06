import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsButton } from '@jsekulowicz/ds-components/button';
import '@jsekulowicz/ds-components/button/define';

export const Button = createComponent({
  tagName: 'ds-button',
  elementClass: DsButton,
  react: React,
  events: {
    'onDsClick': 'ds-click' as EventName<CustomEvent>,
  },
  displayName: 'Button',
});
