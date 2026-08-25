import { defineCustomElement } from '../../registration.js';
import { DsMenu } from './menu.js';
import { DsMenuItem } from './menu-item.js';

defineCustomElement('ds-menu-item', DsMenuItem);
defineCustomElement('ds-menu', DsMenu);

declare global {
  interface HTMLElementTagNameMap {
    'ds-menu': DsMenu;
    'ds-menu-item': DsMenuItem;
  }
}
