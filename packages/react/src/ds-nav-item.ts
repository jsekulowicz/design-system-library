import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsNavItem } from '@ds/components/nav-item';
import '@ds/components/nav-item/define';

export const NavItem = createComponent({
  tagName: 'ds-nav-item',
  elementClass: DsNavItem,
  react: React,
  events: {},
  displayName: 'NavItem',
});
