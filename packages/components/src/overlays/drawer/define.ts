import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import { DsDrawer } from './drawer.js';
import '../../data-display/card/define.js';

defineCustomElement('ds-drawer', DsDrawer);

declare global {
  interface HTMLElementTagNameMap {
    'ds-drawer': DsDrawer;
  }
}
