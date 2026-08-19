import { defineCustomElement } from '../../registration.js';
import '../../atoms/button/define.js';
import { DsDialog } from './dialog.js';
import '../card/define.js';

defineCustomElement('ds-dialog', DsDialog);

declare global {
  interface HTMLElementTagNameMap {
    'ds-dialog': DsDialog;
  }
}
