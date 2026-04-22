import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTab } from '@ds/components/tabs';
import '@ds/components/tabs/define';

export const Tab = createComponent({
  tagName: 'ds-tab',
  elementClass: DsTab,
  react: React,
  events: {},
  displayName: 'Tab',
});
