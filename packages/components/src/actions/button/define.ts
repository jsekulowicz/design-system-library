import { defineCustomElement } from '../../registration.js';
import { DsButton } from './button.js';

defineCustomElement('ds-button', DsButton);

declare global {
  interface HTMLElementTagNameMap {
    'ds-button': DsButton;
  }
}
