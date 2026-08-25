import { defineCustomElement } from '../../registration.js';
import '../../data-display/icon/define.js';
import { DsBreadcrumb } from './breadcrumb.js';
import { DsBreadcrumbItem } from './breadcrumb-item.js';

defineCustomElement('ds-breadcrumb', DsBreadcrumb);
defineCustomElement('ds-breadcrumb-item', DsBreadcrumbItem);

declare global {
  interface HTMLElementTagNameMap {
    'ds-breadcrumb': DsBreadcrumb;
    'ds-breadcrumb-item': DsBreadcrumbItem;
  }
}
