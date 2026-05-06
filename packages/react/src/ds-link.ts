import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsLink } from '@jsekulowicz/ds-components/link';
import '@jsekulowicz/ds-components/link/define';

export const Link = createComponent({
  tagName: 'ds-link',
  elementClass: DsLink,
  react: React,
  events: {},
  displayName: 'Link',
});
