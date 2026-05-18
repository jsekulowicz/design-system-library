import { DsTopBar } from './top-bar.js';

if (!customElements.get('ds-top-bar')) {
  customElements.define('ds-top-bar', DsTopBar);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-top-bar': DsTopBar;
  }
}
