import { DsNavItem } from './nav-item.js';
import { DsNavGroup } from './nav-group.js';

if (!customElements.get('ds-nav-item')) {
  customElements.define('ds-nav-item', DsNavItem);
}
if (!customElements.get('ds-nav-group')) {
  customElements.define('ds-nav-group', DsNavGroup);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-nav-item': DsNavItem;
    'ds-nav-group': DsNavGroup;
  }
}
