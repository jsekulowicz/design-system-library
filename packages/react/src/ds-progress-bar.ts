import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsProgressBar } from '@jsekulowicz/ds-components/progress-bar';
import '@jsekulowicz/ds-components/progress-bar/define';

export const ProgressBar = createComponent({
  tagName: 'ds-progress-bar',
  elementClass: DsProgressBar,
  react: React,
  events: {},
  displayName: 'ProgressBar',
});
