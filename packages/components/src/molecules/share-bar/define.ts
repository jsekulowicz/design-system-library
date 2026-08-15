import { DsShareBar } from './share-bar.js';

if (!customElements.get('ds-share-bar')) {
  customElements.define('ds-share-bar', DsShareBar);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-share-bar': DsShareBar;
  }
}
