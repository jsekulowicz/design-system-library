import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsBreadcrumbItem } from '@jsekulowicz/ds-components/breadcrumb';
import '@jsekulowicz/ds-components/breadcrumb/define';

export const BreadcrumbItem = createComponent({
  tagName: 'ds-breadcrumb-item',
  elementClass: DsBreadcrumbItem,
  react: React,
  events: {},
  displayName: 'BreadcrumbItem',
});
