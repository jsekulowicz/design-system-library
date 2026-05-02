import { DsDialog } from './dialog.js';
import '../card/define.js';

if (!customElements.get('ds-dialog')) {
  customElements.define('ds-dialog', DsDialog);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-dialog': DsDialog;
  }
}
