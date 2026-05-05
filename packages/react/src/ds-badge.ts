import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsBadge } from '@jsekulowicz/ds-components/badge';
import '@jsekulowicz/ds-components/badge/define';

export const Badge = createComponent({
  tagName: 'ds-badge',
  elementClass: DsBadge,
  react: React,
  events: {},
  displayName: 'Badge',
});
