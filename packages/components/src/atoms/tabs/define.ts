import { DsTabs } from './tabs.js';
import { DsTab } from './tab.js';
import { DsTabPanel } from './tab-panel.js';

if (!customElements.get('ds-tabs')) {
  customElements.define('ds-tabs', DsTabs);
}
if (!customElements.get('ds-tab')) {
  customElements.define('ds-tab', DsTab);
}
if (!customElements.get('ds-tab-panel')) {
  customElements.define('ds-tab-panel', DsTabPanel);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-tabs': DsTabs;
    'ds-tab': DsTab;
    'ds-tab-panel': DsTabPanel;
  }
}
