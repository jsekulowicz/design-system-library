import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsFooter } from '@ds/components/footer';
import '@ds/components/footer/define';

export const Footer = createComponent({
  tagName: 'ds-footer',
  elementClass: DsFooter,
  react: React,
  events: {},
  displayName: 'Footer',
});
