import { DsBreadcrumb } from './breadcrumb.js';
import { DsBreadcrumbItem } from './breadcrumb-item.js';

if (!customElements.get('ds-breadcrumb')) {
  customElements.define('ds-breadcrumb', DsBreadcrumb);
}
if (!customElements.get('ds-breadcrumb-item')) {
  customElements.define('ds-breadcrumb-item', DsBreadcrumbItem);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-breadcrumb': DsBreadcrumb;
    'ds-breadcrumb-item': DsBreadcrumbItem;
  }
}
