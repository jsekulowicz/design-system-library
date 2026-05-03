import { DsSelect } from './select.js';
import { DsSelectOption } from './select-option.js';

if (!customElements.get('ds-select-option')) {
  customElements.define('ds-select-option', DsSelectOption);
}
if (!customElements.get('ds-select')) {
  customElements.define('ds-select', DsSelect);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-select': DsSelect;
    'ds-select-option': DsSelectOption;
  }
}
