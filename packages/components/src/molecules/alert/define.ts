import { defineCustomElement } from '../../registration.js';
import '../../atoms/button/define.js';
import { DsAlert } from './alert.js';

defineCustomElement('ds-alert', DsAlert);

declare global {
  interface HTMLElementTagNameMap {
    'ds-alert': DsAlert;
  }
}
