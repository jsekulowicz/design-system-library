import { defineCustomElement } from '../../registration.js';
import { DsCard } from './card.js';

defineCustomElement('ds-card', DsCard);

declare global {
  interface HTMLElementTagNameMap {
    'ds-card': DsCard;
  }
}
