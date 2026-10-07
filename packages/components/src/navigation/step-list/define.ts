import { defineCustomElement } from '../../registration.js';
import '../../data-display/icon/define.js';
import '../../overlays/tooltip/define.js';
import { DsStepList } from './step-list.js';

defineCustomElement('ds-step-list', DsStepList);

declare global {
  interface HTMLElementTagNameMap {
    'ds-step-list': DsStepList;
  }
}
