import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import { DsAlert } from './alert.js';

defineCustomElement('ds-alert', DsAlert);

declare global {
  interface HTMLElementTagNameMap {
    'ds-alert': DsAlert;
  }
}
