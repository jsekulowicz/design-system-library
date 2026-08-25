import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import '../../data-display/icon/define.js';
import '../../overlays/drawer/define.js';
import '../../navigation/top-bar/define.js';
import { DsPageShell } from './page-shell.js';

defineCustomElement('ds-page-shell', DsPageShell);

declare global {
  interface HTMLElementTagNameMap {
    'ds-page-shell': DsPageShell;
  }
}
