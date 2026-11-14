import { defineCustomElement } from '../../registration.js';
import '../../data-display/icon/define.js';
import { DsTextField } from './text-field.js';

defineCustomElement('ds-text-field', DsTextField);

declare global {
  interface HTMLElementTagNameMap {
    'ds-text-field': DsTextField;
  }
}
