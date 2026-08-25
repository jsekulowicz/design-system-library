import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import { DsToast } from './toast.js';
import { DsToastStack } from './toast-stack.js';

defineCustomElement('ds-toast', DsToast);
defineCustomElement('ds-toast-stack', DsToastStack);

declare global {
  interface HTMLElementTagNameMap {
    'ds-toast': DsToast;
    'ds-toast-stack': DsToastStack;
  }
}
