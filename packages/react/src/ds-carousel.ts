import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsCarousel } from '@jsekulowicz/ds-components/carousel';
import '@jsekulowicz/ds-components/carousel/define';

export const Carousel = createComponent({
  tagName: 'ds-carousel',
  elementClass: DsCarousel,
  react: React,
  events: {},
  displayName: 'Carousel',
});
