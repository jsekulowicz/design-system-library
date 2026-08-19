import { defineCustomElement } from '../../registration.js';
import '../icon/define.js';
import { DsSelect } from './select.js';
import { DsSelectOption } from './select-option.js';

defineCustomElement('ds-select-option', DsSelectOption);
defineCustomElement('ds-select', DsSelect);

declare global {
  interface HTMLElementTagNameMap {
    'ds-select': DsSelect;
    'ds-select-option': DsSelectOption;
  }
}
