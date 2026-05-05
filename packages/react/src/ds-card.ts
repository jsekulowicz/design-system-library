import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsCard } from '@jsekulowicz/ds-components/card';
import '@jsekulowicz/ds-components/card/define';

export const Card = createComponent({
  tagName: 'ds-card',
  elementClass: DsCard,
  react: React,
  events: {},
  displayName: 'Card',
});
