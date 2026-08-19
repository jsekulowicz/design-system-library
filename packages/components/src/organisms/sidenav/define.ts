import { defineCustomElement } from '../../registration.js';
import { DsSidenav } from './sidenav.js';

defineCustomElement('ds-sidenav', DsSidenav);

declare global {
  interface HTMLElementTagNameMap {
    'ds-sidenav': DsSidenav;
  }
}
