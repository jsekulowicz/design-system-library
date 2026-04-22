import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsBreadcrumb } from '@ds/components/breadcrumb';
import '@ds/components/breadcrumb/define';

export const Breadcrumb = createComponent({
  tagName: 'ds-breadcrumb',
  elementClass: DsBreadcrumb,
  react: React,
  events: {},
  displayName: 'Breadcrumb',
});
