import { DsBadge } from './badge.js';

if (!customElements.get('ds-badge')) {
  customElements.define('ds-badge', DsBadge);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-badge': DsBadge;
  }
}
