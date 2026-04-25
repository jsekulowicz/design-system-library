import { DsFooter } from './footer.js';

if (!customElements.get('ds-footer')) {
  customElements.define('ds-footer', DsFooter);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-footer': DsFooter;
  }
}
