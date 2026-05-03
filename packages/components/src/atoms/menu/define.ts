import { DsMenu } from './menu.js';
import { DsMenuItem } from './menu-item.js';

if (!customElements.get('ds-menu-item')) {
  customElements.define('ds-menu-item', DsMenuItem);
}
if (!customElements.get('ds-menu')) {
  customElements.define('ds-menu', DsMenu);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-menu': DsMenu;
    'ds-menu-item': DsMenuItem;
  }
}
