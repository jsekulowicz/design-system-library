import { DsLink } from './link.js';

if (!customElements.get('ds-link')) {
  customElements.define('ds-link', DsLink);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-link': DsLink;
  }
}
