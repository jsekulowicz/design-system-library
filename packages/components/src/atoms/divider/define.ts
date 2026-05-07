import { DsDivider } from './divider.js';

if (!customElements.get('ds-divider')) {
  customElements.define('ds-divider', DsDivider);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-divider': DsDivider;
  }
}
