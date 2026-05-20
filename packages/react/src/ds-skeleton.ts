import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsSkeleton } from '@jsekulowicz/ds-components/skeleton';
import '@jsekulowicz/ds-components/skeleton/define';

export const Skeleton = createComponent({
  tagName: 'ds-skeleton',
  elementClass: DsSkeleton,
  react: React,
  events: {},
  displayName: 'Skeleton',
});
