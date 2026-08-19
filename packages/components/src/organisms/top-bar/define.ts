import { defineCustomElement } from '../../registration.js';
import { DsTopBar } from './top-bar.js';

defineCustomElement('ds-top-bar', DsTopBar);

declare global {
  interface HTMLElementTagNameMap {
    'ds-top-bar': DsTopBar;
  }
}
