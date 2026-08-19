import { defineCustomElement } from '../../registration.js';
import '../../atoms/button/define.js';
import { DsDrawer } from './drawer.js';
import '../card/define.js';

defineCustomElement('ds-drawer', DsDrawer);

declare global {
  interface HTMLElementTagNameMap {
    'ds-drawer': DsDrawer;
  }
}
