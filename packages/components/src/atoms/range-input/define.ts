import { defineCustomElement } from '../../registration.js';
import { DsRangeInput } from './range-input.js';

defineCustomElement('ds-range-input', DsRangeInput);

declare global {
  interface HTMLElementTagNameMap {
    'ds-range-input': DsRangeInput;
  }
}
