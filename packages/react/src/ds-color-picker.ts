import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsColorPicker } from '@ds/components/color-picker';
import '@ds/components/color-picker/define';

export const ColorPicker = createComponent({
  tagName: 'ds-color-picker',
  elementClass: DsColorPicker,
  react: React,
  events: {
    'onDsInput': 'ds-input' as EventName<CustomEvent>,
    'onDsChange': 'ds-change' as EventName<CustomEvent>,
  },
  displayName: 'ColorPicker',
});
