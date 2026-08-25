import { defineCustomElement } from '../../registration.js';
import { DsCheckboxGroup } from './checkbox-group.js';

defineCustomElement('ds-checkbox-group', DsCheckboxGroup);

declare global {
  interface HTMLElementTagNameMap {
    'ds-checkbox-group': DsCheckboxGroup;
  }
}
