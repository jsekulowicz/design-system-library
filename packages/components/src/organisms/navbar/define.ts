import { DsNavbar } from './navbar.js';

if (!customElements.get('ds-navbar')) {
  customElements.define('ds-navbar', DsNavbar);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-navbar': DsNavbar;
  }
}
