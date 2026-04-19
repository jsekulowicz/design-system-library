import { DsSearchableSelect } from './searchable-select.js';

if (!customElements.get('ds-searchable-select')) {
  customElements.define('ds-searchable-select', DsSearchableSelect);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-searchable-select': DsSearchableSelect;
  }
}
