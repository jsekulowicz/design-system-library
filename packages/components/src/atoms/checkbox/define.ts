import { defineCustomElement } from '../../registration.js';
import { DsCheckbox } from './checkbox.js';

defineCustomElement('ds-checkbox', DsCheckbox);

declare global {
  interface HTMLElementTagNameMap {
    'ds-checkbox': DsCheckbox;
  }
}
