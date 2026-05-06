import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsColorPickerSwatchGroup } from '@jsekulowicz/ds-components/color-picker';
import '@jsekulowicz/ds-components/color-picker/define';

export const ColorPickerSwatchGroup = createComponent({
  tagName: 'ds-color-picker-swatch-group',
  elementClass: DsColorPickerSwatchGroup,
  react: React,
  events: {
    'onDsColorPickerSwatchGroupSelect': 'ds-color-picker-swatch-group-select' as EventName<CustomEvent>,
  },
  displayName: 'ColorPickerSwatchGroup',
});
