import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsToast } from '@jsekulowicz/ds-components/toast';
import '@jsekulowicz/ds-components/toast/define';

export const Toast = createComponent({
  tagName: 'ds-toast',
  elementClass: DsToast,
  react: React,
  events: {
    'onDsDismiss': 'ds-dismiss' as EventName<CustomEvent>,
  },
  displayName: 'Toast',
});
