import { DsList } from './list.js';
import { DsListItem } from './list-item.js';

if (!customElements.get('ds-list')) {
  customElements.define('ds-list', DsList);
}
if (!customElements.get('ds-list-item')) {
  customElements.define('ds-list-item', DsListItem);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-list': DsList;
    'ds-list-item': DsListItem;
  }
}
