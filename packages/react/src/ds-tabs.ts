import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsTabs } from '@ds/components/tabs';
import '@ds/components/tabs/define';

export const Tabs = createComponent({
  tagName: 'ds-tabs',
  elementClass: DsTabs,
  react: React,
  events: {
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'Tabs',
});
