import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsSidenav } from '@ds/components/sidenav';
import '@ds/components/sidenav/define';

export const Sidenav = createComponent({
  tagName: 'ds-sidenav',
  elementClass: DsSidenav,
  react: React,
  events: {},
  displayName: 'Sidenav',
});
