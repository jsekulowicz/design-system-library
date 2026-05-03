import { DsColorPicker } from './color-picker.js';
import { DsColorPickerSwatch } from './color-picker-swatch.js';
import '../card/define.js';
import '../../atoms/button/define.js';

if (!customElements.get('ds-color-picker')) {
  customElements.define('ds-color-picker', DsColorPicker);
}
if (!customElements.get('ds-color-picker-swatch')) {
  customElements.define('ds-color-picker-swatch', DsColorPickerSwatch);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-color-picker': DsColorPicker;
    'ds-color-picker-swatch': DsColorPickerSwatch;
  }
}
