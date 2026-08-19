import { defineCustomElement } from '../../registration.js';
import { DsTabs } from './tabs.js';
import { DsTab } from './tab.js';
import { DsTabPanel } from './tab-panel.js';

defineCustomElement('ds-tabs', DsTabs);
defineCustomElement('ds-tab', DsTab);
defineCustomElement('ds-tab-panel', DsTabPanel);

declare global {
  interface HTMLElementTagNameMap {
    'ds-tabs': DsTabs;
    'ds-tab': DsTab;
    'ds-tab-panel': DsTabPanel;
  }
}
