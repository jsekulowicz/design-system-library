import { defineCustomElement } from '../../registration.js';
import { DsRadio } from './radio.js';

defineCustomElement('ds-radio', DsRadio);

declare global {
  interface HTMLElementTagNameMap {
    'ds-radio': DsRadio;
  }
}
