import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsPageShell } from '@jsekulowicz/ds-components/page-shell';
import '@jsekulowicz/ds-components/page-shell/define';

export const PageShell = createComponent({
  tagName: 'ds-page-shell',
  elementClass: DsPageShell,
  react: React,
  events: {
    'onDsAsideStateChange': 'ds-aside-state-change' as EventName<CustomEvent>,
  },
  displayName: 'PageShell',
});
