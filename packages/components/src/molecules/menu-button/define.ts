import { defineCustomElement } from '../../registration.js';
import { DsMenuButton } from './menu-button.js';
import '../../atoms/button/define.js';
import '../../atoms/menu/define.js';

defineCustomElement('ds-menu-button', DsMenuButton);

declare global {
  interface HTMLElementTagNameMap {
    'ds-menu-button': DsMenuButton;
  }
}
