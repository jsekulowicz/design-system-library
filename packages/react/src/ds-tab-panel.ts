import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTabPanel } from '@ds/components/tabs';
import '@ds/components/tabs/define';

export const TabPanel = createComponent({
  tagName: 'ds-tab-panel',
  elementClass: DsTabPanel,
  react: React,
  events: {},
  displayName: 'TabPanel',
});
