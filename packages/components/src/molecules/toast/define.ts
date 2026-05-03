import { DsToast } from './toast.js';
import { DsToastStack } from './toast-stack.js';

if (!customElements.get('ds-toast')) {
  customElements.define('ds-toast', DsToast);
}
if (!customElements.get('ds-toast-stack')) {
  customElements.define('ds-toast-stack', DsToastStack);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-toast': DsToast;
    'ds-toast-stack': DsToastStack;
  }
}
