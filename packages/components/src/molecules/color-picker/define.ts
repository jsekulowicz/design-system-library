import { DsColorPicker } from './color-picker.js';
import '../card/define.js';
import '../../atoms/button/define.js';

if (!customElements.get('ds-color-picker')) {
  customElements.define('ds-color-picker', DsColorPicker);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-color-picker': DsColorPicker;
  }
}
