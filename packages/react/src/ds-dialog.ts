import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsDialog } from '@jsekulowicz/ds-components/dialog';
import '@jsekulowicz/ds-components/dialog/define';

export const Dialog = createComponent({
  tagName: 'ds-dialog',
  elementClass: DsDialog,
  react: React,
  events: {
    'onDsOpen': 'ds-open' as EventName<CustomEvent>,
    'onDsClose': 'ds-close' as EventName<CustomEvent>,
    'onDsCancel': 'ds-cancel' as EventName<CustomEvent>,
  },
  displayName: 'Dialog',
});
