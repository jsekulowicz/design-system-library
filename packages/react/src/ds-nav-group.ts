import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsNavGroup } from '@jsekulowicz/ds-components/nav-item';
import type { NavGroupToggleDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/nav-item/define';

export const NavGroup = createComponent({
  tagName: 'ds-nav-group',
  elementClass: DsNavGroup,
  react: React,
  events: {
    'onDsGroupToggle': 'ds-group-toggle' as EventName<CustomEvent<NavGroupToggleDetail>>,
  },
  displayName: 'NavGroup',
});
