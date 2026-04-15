import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsBadge } from '@ds/components/badge';
import '@ds/components/badge/define';

export const Badge = createComponent({
  tagName: 'ds-badge',
  elementClass: DsBadge,
  react: React,
  events: {},
  displayName: 'Badge',
});
