import { DsTextField } from './text-field.js';

if (!customElements.get('ds-text-field')) {
  customElements.define('ds-text-field', DsTextField);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-text-field': DsTextField;
  }
}
