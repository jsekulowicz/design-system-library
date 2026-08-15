import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsShareBar } from '@jsekulowicz/ds-components/share-bar';
import '@jsekulowicz/ds-components/share-bar/define';

export const ShareBar = createComponent({
  tagName: 'ds-share-bar',
  elementClass: DsShareBar,
  react: React,
  events: {},
  displayName: 'ShareBar',
});
