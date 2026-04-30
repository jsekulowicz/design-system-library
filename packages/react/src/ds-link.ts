import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsLink } from '@ds/components/link';
import '@ds/components/link/define';

export const Link = createComponent({
  tagName: 'ds-link',
  elementClass: DsLink,
  react: React,
  events: {},
  displayName: 'Link',
});
