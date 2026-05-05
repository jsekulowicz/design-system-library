import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsNavbar } from '@jsekulowicz/ds-components/navbar';
import '@jsekulowicz/ds-components/navbar/define';

export const Navbar = createComponent({
  tagName: 'ds-navbar',
  elementClass: DsNavbar,
  react: React,
  events: {},
  displayName: 'Navbar',
});
