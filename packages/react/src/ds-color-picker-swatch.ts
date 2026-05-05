import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsColorPickerSwatch } from '@jsekulowicz/ds-components/color-picker';
import '@jsekulowicz/ds-components/color-picker/define';

export const ColorPickerSwatch = createComponent({
  tagName: 'ds-color-picker-swatch',
  elementClass: DsColorPickerSwatch,
  react: React,
  events: {
    'onDsColorPickerSwatchSelect': 'ds-color-picker-swatch-select' as EventName<CustomEvent>,
  },
  displayName: 'ColorPickerSwatch',
});
