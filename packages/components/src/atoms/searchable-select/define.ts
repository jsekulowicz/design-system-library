import { DsSearchableSelect } from './searchable-select.js';
import '../select/define.js';

if (!customElements.get('ds-searchable-select')) {
  customElements.define('ds-searchable-select', DsSearchableSelect);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-searchable-select': DsSearchableSelect;
  }
}
