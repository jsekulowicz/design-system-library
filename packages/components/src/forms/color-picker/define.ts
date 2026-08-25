import { defineCustomElement } from '../../registration.js';
import { DsColorPicker } from './color-picker.js';
import { DsColorPickerInputColor } from './input-color.js';
import { DsColorPickerSwatch } from './color-picker-swatch.js';
import { DsColorPickerSwatchGroup } from './color-picker-swatch-group.js';
import '../../data-display/card/define.js';
import '../../actions/button/define.js';
import '../../data-display/icon/define.js';
import '../../data-display/icon/icons/swatch.js';
import '../text-field/define.js';

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
