import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsBreadcrumbItem } from '@ds/components/breadcrumb';
import '@ds/components/breadcrumb/define';

export const BreadcrumbItem = createComponent({
  tagName: 'ds-breadcrumb-item',
  elementClass: DsBreadcrumbItem,
  react: React,
  events: {},
  displayName: 'BreadcrumbItem',
});
