import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsPageShell } from '@ds/components/page-shell';
import '@ds/components/page-shell/define';

export const PageShell = createComponent({
  tagName: 'ds-page-shell',
  elementClass: DsPageShell,
  react: React,
  events: {},
  displayName: 'PageShell',
});
