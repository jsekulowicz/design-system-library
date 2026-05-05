import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsColorPickerInputColor } from '@jsekulowicz/ds-components/color-picker';
import '@jsekulowicz/ds-components/color-picker/define';

export const ColorPickerInputColor = createComponent({
  tagName: 'ds-color-picker-input-color',
  elementClass: DsColorPickerInputColor,
  react: React,
  events: {
    'onDsInput': 'ds-input' as EventName<CustomEvent>,
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'ColorPickerInputColor',
});
