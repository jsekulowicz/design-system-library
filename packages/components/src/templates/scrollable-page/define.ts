import { DsScrollablePage } from './scrollable-page.js';

if (!customElements.get('ds-scrollable-page')) {
  customElements.define('ds-scrollable-page', DsScrollablePage);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-scrollable-page': DsScrollablePage;
  }
}
