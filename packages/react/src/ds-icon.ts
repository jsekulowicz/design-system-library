import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsIcon } from '@ds/components/icon';
import '@ds/components/icon/define';

export const Icon = createComponent({
  tagName: 'ds-icon',
  elementClass: DsIcon,
  react: React,
  events: {},
  displayName: 'Icon',
});
