import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsCard } from '@ds/components/card';
import '@ds/components/card/define';

export const Card = createComponent({
  tagName: 'ds-card',
  elementClass: DsCard,
  react: React,
  events: {},
  displayName: 'Card',
});
