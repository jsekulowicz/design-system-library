import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsSidenav } from '@jsekulowicz/ds-components/sidenav';
import '@jsekulowicz/ds-components/sidenav/define';

export const Sidenav = createComponent({
  tagName: 'ds-sidenav',
  elementClass: DsSidenav,
  react: React,
  events: {},
  displayName: 'Sidenav',
});
