import { defineCustomElement } from '../../registration.js';
import { DsList } from './list.js';
import { DsListItem } from './list-item.js';

defineCustomElement('ds-list', DsList);
defineCustomElement('ds-list-item', DsListItem);

declare global {
  interface HTMLElementTagNameMap {
    'ds-list': DsList;
    'ds-list-item': DsListItem;
  }
}
