import { DsRadioGroup } from './radio-group.js';

if (!customElements.get('ds-radio-group')) {
  customElements.define('ds-radio-group', DsRadioGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-radio-group': DsRadioGroup;
  }
}
