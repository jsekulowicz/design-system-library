import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsTooltip } from '@ds/components/tooltip';
import '@ds/components/tooltip/define';

export const Tooltip = createComponent({
  tagName: 'ds-tooltip',
  elementClass: DsTooltip,
  react: React,
  events: {},
  displayName: 'Tooltip',
});
