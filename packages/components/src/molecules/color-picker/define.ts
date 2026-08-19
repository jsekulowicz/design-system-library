import { defineCustomElement } from '../../registration.js';
import { DsColorPicker } from './color-picker.js';
import { DsColorPickerInputColor } from './input-color.js';
import { DsColorPickerSwatch } from './color-picker-swatch.js';
import { DsColorPickerSwatchGroup } from './color-picker-swatch-group.js';
import '../card/define.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/define.js';
import '../../atoms/icon/icons/swatch.js';
import '../../atoms/text-field/define.js';

defineCustomElement('ds-color-picker', DsColorPicker);
defineCustomElement('ds-color-picker-swatch', DsColorPickerSwatch);
defineCustomElement('ds-color-picker-swatch-group', DsColorPickerSwatchGroup);
defineCustomElement('ds-color-picker-input-color', DsColorPickerInputColor);

declare global {
  interface HTMLElementTagNameMap {
    'ds-color-picker': DsColorPicker;
    'ds-color-picker-swatch': DsColorPickerSwatch;
    'ds-color-picker-swatch-group': DsColorPickerSwatchGroup;
    'ds-color-picker-input-color': DsColorPickerInputColor;
  }
}
