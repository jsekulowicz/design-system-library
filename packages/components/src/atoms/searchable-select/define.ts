import { defineCustomElement } from '../../registration.js';
import '../icon/define.js';
import { DsSearchableSelect } from './searchable-select.js';
import '../select/define.js';

defineCustomElement('ds-searchable-select', DsSearchableSelect);

declare global {
  interface HTMLElementTagNameMap {
    'ds-searchable-select': DsSearchableSelect;
  }
}
