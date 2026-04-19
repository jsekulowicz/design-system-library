import { DsCheckboxGroup } from './checkbox-group.js';

if (!customElements.get('ds-checkbox-group')) {
  customElements.define('ds-checkbox-group', DsCheckboxGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-checkbox-group': DsCheckboxGroup;
  }
}
