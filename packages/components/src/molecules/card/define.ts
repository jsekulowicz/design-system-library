import { DsCard } from './card.js';

if (!customElements.get('ds-card')) {
  customElements.define('ds-card', DsCard);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-card': DsCard;
  }
}
