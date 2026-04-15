import { DsAlert } from './alert.js';

if (!customElements.get('ds-alert')) {
  customElements.define('ds-alert', DsAlert);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-alert': DsAlert;
  }
}
