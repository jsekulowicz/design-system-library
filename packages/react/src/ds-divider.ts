import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsDivider } from '@jsekulowicz/ds-components/divider';
import '@jsekulowicz/ds-components/divider/define';

export const Divider = createComponent({
  tagName: 'ds-divider',
  elementClass: DsDivider,
  react: React,
  events: {},
  displayName: 'Divider',
});
