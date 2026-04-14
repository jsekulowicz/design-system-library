import { DsSelect } from './select.js';

if (!customElements.get('ds-select')) {
  customElements.define('ds-select', DsSelect);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-select': DsSelect;
  }
}
