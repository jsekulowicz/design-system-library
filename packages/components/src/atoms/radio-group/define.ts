import { defineCustomElement } from '../../registration.js';
import { DsRadioGroup } from './radio-group.js';

defineCustomElement('ds-radio-group', DsRadioGroup);

declare global {
  interface HTMLElementTagNameMap {
    'ds-radio-group': DsRadioGroup;
  }
}
