import { DsButton } from './button.js';

if (!customElements.get('ds-button')) {
  customElements.define('ds-button', DsButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
