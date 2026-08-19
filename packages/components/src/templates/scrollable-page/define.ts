import { defineCustomElement } from '../../registration.js';
import { DsScrollablePage } from './scrollable-page.js';

defineCustomElement('ds-scrollable-page', DsScrollablePage);

declare global {
  interface HTMLElementTagNameMap {
    'ds-scrollable-page': DsScrollablePage;
  }
}
