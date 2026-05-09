import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsList } from '@jsekulowicz/ds-components/list';
import '@jsekulowicz/ds-components/list/define';

export const List = createComponent({
  tagName: 'ds-list',
  elementClass: DsList,
  react: React,
  events: {},
  displayName: 'List',
});
