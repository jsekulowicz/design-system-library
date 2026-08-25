import { defineCustomElement } from '../../registration.js';
import { DsIcon } from './icon.js';

defineCustomElement('ds-icon', DsIcon);

declare global {
  interface HTMLElementTagNameMap {
    'ds-icon': DsIcon;
  }
}
