import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsStatTile } from '@jsekulowicz/ds-components/stat-tile';
import '@jsekulowicz/ds-components/stat-tile/define';

export const StatTile = createComponent({
  tagName: 'ds-stat-tile',
  elementClass: DsStatTile,
  react: React,
  events: {},
  displayName: 'StatTile',
});
