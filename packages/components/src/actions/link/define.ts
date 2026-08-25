import { defineCustomElement } from '../../registration.js';
import { DsLink } from './link.js';

defineCustomElement('ds-link', DsLink);

declare global {
  interface HTMLElementTagNameMap {
    'ds-link': DsLink;
  }
}
