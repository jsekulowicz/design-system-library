import { defineCustomElement } from '../../registration.js';
import { DsMenuButton } from './menu-button.js';
import '../../actions/button/define.js';
import '../menu/define.js';

defineCustomElement('ds-menu-button', DsMenuButton);

declare global {
  interface HTMLElementTagNameMap {
    'ds-menu-button': DsMenuButton;
  }
}
