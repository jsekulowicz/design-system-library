import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsScrollablePage } from '@jsekulowicz/ds-components/scrollable-page';
import '@jsekulowicz/ds-components/scrollable-page/define';

export const ScrollablePage = createComponent({
  tagName: 'ds-scrollable-page',
  elementClass: DsScrollablePage,
  react: React,
  events: {},
  displayName: 'ScrollablePage',
});
