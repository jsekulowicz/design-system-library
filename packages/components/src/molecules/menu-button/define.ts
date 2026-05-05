import { DsMenuButton } from './menu-button.js';
import '../../atoms/button/define.js';
import '../../atoms/menu/define.js';

if (!customElements.get('ds-menu-button')) {
  customElements.define('ds-menu-button', DsMenuButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-menu-button': DsMenuButton;
  }
}
