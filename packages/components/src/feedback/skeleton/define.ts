import { defineCustomElement } from '../../registration.js';
import { DsSkeleton } from './skeleton.js';

defineCustomElement('ds-skeleton', DsSkeleton);

declare global {
  interface HTMLElementTagNameMap {
    'ds-skeleton': DsSkeleton;
  }
}
