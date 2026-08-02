import { DsFieldset } from './fieldset.js';

if (!customElements.get('ds-fieldset')) {
  customElements.define('ds-fieldset', DsFieldset);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-fieldset': DsFieldset;
  }
}
