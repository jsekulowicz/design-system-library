import { DsTextArea } from './text-area.js';

if (!customElements.get('ds-text-area')) {
  customElements.define('ds-text-area', DsTextArea);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-text-area': DsTextArea;
  }
}
