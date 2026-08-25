import { defineCustomElement } from '../../registration.js';
import { DsDivider } from './divider.js';

defineCustomElement('ds-divider', DsDivider);

declare global {
  interface HTMLElementTagNameMap {
    'ds-divider': DsDivider;
  }
}
