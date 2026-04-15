import { DsField } from './field.js';

if (!customElements.get('ds-field')) {
  customElements.define('ds-field', DsField);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-field': DsField;
  }
}
