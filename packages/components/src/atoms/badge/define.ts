import { defineCustomElement } from '../../registration.js';
import { DsBadge } from './badge.js';

defineCustomElement('ds-badge', DsBadge);

declare global {
  interface HTMLElementTagNameMap {
    'ds-badge': DsBadge;
  }
}
