import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsToastStack } from '@jsekulowicz/ds-components/toast';
import '@jsekulowicz/ds-components/toast/define';

export const ToastStack = createComponent({
  tagName: 'ds-toast-stack',
  elementClass: DsToastStack,
  react: React,
  events: {},
  displayName: 'ToastStack',
});
