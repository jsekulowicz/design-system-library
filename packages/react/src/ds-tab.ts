import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsTab } from '@jsekulowicz/ds-components/tabs';
import '@jsekulowicz/ds-components/tabs/define';

export const Tab = createComponent({
  tagName: 'ds-tab',
  elementClass: DsTab,
  react: React,
  events: {},
  displayName: 'Tab',
});
