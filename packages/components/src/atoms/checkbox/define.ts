import { DsCheckbox } from './checkbox.js';

if (!customElements.get('ds-checkbox')) {
  customElements.define('ds-checkbox', DsCheckbox);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-checkbox': DsCheckbox;
  }
}
