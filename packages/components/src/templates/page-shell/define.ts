import { DsPageShell } from './page-shell.js';

if (!customElements.get('ds-page-shell')) {
  customElements.define('ds-page-shell', DsPageShell);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-page-shell': DsPageShell;
  }
}
