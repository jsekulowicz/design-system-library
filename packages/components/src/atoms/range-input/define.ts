import { DsRangeInput } from './range-input.js';

if (!customElements.get('ds-range-input')) {
  customElements.define('ds-range-input', DsRangeInput);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-range-input': DsRangeInput;
  }
}
