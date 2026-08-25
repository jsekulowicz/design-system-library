import { defineCustomElement } from '../../registration.js';
import { DsFieldset } from './fieldset.js';

defineCustomElement('ds-fieldset', DsFieldset);

declare global {
  interface HTMLElementTagNameMap {
    'ds-fieldset': DsFieldset;
  }
}
