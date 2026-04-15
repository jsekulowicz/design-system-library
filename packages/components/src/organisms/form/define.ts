import { DsForm } from './form.js';

if (!customElements.get('ds-form')) {
  customElements.define('ds-form', DsForm);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-form': DsForm;
  }
}
