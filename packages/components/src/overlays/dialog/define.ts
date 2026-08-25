import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import { DsDialog } from './dialog.js';
import '../../data-display/card/define.js';

defineCustomElement('ds-dialog', DsDialog);

declare global {
  interface HTMLElementTagNameMap {
    'ds-dialog': DsDialog;
  }
}
