import { DsDrawer } from './drawer.js';
import '../card/define.js';

if (!customElements.get('ds-drawer')) {
  customElements.define('ds-drawer', DsDrawer);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-drawer': DsDrawer;
  }
}
