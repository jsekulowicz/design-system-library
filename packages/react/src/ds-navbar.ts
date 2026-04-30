import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsNavbar } from '@ds/components/navbar';
import '@ds/components/navbar/define';

export const Navbar = createComponent({
  tagName: 'ds-navbar',
  elementClass: DsNavbar,
  react: React,
  events: {},
  displayName: 'Navbar',
});
