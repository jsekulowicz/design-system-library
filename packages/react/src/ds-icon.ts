import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsIcon } from '@jsekulowicz/ds-components/icon';
import '@jsekulowicz/ds-components/icon/define';

export const Icon = createComponent({
  tagName: 'ds-icon',
  elementClass: DsIcon,
  react: React,
  events: {},
  displayName: 'Icon',
});
