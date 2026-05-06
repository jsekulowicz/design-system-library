import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsAlert } from '@jsekulowicz/ds-components/alert';
import '@jsekulowicz/ds-components/alert/define';

export const Alert = createComponent({
  tagName: 'ds-alert',
  elementClass: DsAlert,
  react: React,
  events: {
    'onDsDismiss': 'ds-dismiss' as EventName<CustomEvent>,
  },
  displayName: 'Alert',
});
