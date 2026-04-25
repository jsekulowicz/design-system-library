import { DsSidenav } from './sidenav.js';

if (!customElements.get('ds-sidenav')) {
  customElements.define('ds-sidenav', DsSidenav);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-sidenav': DsSidenav;
  }
}
