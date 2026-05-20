import { DsSkeleton } from './skeleton.js';

if (!customElements.get('ds-skeleton')) {
  customElements.define('ds-skeleton', DsSkeleton);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-skeleton': DsSkeleton;
  }
}
