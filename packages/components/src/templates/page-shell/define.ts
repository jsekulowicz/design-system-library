import { defineCustomElement } from '../../registration.js';
import '../../atoms/button/define.js';
import '../../atoms/icon/define.js';
import '../../molecules/drawer/define.js';
import '../../organisms/top-bar/define.js';
import { DsPageShell } from './page-shell.js';

defineCustomElement('ds-page-shell', DsPageShell);

declare global {
  interface HTMLElementTagNameMap {
    'ds-page-shell': DsPageShell;
  }
}
