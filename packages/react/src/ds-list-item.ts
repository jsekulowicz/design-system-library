import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsListItem } from '@jsekulowicz/ds-components/list';
import '@jsekulowicz/ds-components/list/define';

export const ListItem = createComponent({
  tagName: 'ds-list-item',
  elementClass: DsListItem,
  react: React,
  events: {},
  displayName: 'ListItem',
});
