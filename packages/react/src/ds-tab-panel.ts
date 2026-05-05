import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsTabPanel } from '@jsekulowicz/ds-components/tabs';
import '@jsekulowicz/ds-components/tabs/define';

export const TabPanel = createComponent({
  tagName: 'ds-tab-panel',
  elementClass: DsTabPanel,
  react: React,
  events: {},
  displayName: 'TabPanel',
});
