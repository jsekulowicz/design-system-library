import { defineCustomElement } from '../../registration.js';
import '../tooltip/define.js';
import { DsNavItem } from './nav-item.js';
import { DsNavGroup } from './nav-group.js';

defineCustomElement('ds-nav-item', DsNavItem);
defineCustomElement('ds-nav-group', DsNavGroup);

declare global {
  interface HTMLElementTagNameMap {
    'ds-nav-item': DsNavItem;
    'ds-nav-group': DsNavGroup;
  }
}
