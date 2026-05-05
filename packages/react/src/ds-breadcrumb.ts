import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsBreadcrumb } from '@jsekulowicz/ds-components/breadcrumb';
import '@jsekulowicz/ds-components/breadcrumb/define';

export const Breadcrumb = createComponent({
  tagName: 'ds-breadcrumb',
  elementClass: DsBreadcrumb,
  react: React,
  events: {},
  displayName: 'Breadcrumb',
});
