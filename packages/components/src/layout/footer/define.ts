import { defineCustomElement } from '../../registration.js';
import { DsFooter } from './footer.js';

defineCustomElement('ds-footer', DsFooter);

declare global {
  interface HTMLElementTagNameMap {
    'ds-footer': DsFooter;
  }
}
