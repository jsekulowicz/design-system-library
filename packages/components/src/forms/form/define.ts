import { defineCustomElement } from '../../registration.js';
import { DsForm } from './form.js';

defineCustomElement('ds-form', DsForm);

declare global {
  interface HTMLElementTagNameMap {
    'ds-form': DsForm;
  }
}
