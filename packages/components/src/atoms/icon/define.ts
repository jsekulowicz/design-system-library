import { DsIcon } from './icon.js';

if (!customElements.get('ds-icon')) {
  customElements.define('ds-icon', DsIcon);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-icon': DsIcon;
  }
}
