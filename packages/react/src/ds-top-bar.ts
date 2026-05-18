import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsTopBar } from '@jsekulowicz/ds-components/top-bar';
import '@jsekulowicz/ds-components/top-bar/define';

export const TopBar = createComponent({
  tagName: 'ds-top-bar',
  elementClass: DsTopBar,
  react: React,
  events: {},
  displayName: 'TopBar',
});
