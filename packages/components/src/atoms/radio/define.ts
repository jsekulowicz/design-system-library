import { DsRadio } from './radio.js';

if (!customElements.get('ds-radio')) {
  customElements.define('ds-radio', DsRadio);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-radio': DsRadio;
  }
}
