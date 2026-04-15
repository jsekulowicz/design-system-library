import { DsSettingsPage } from './settings-page.js';

if (!customElements.get('ds-settings-page')) {
  customElements.define('ds-settings-page', DsSettingsPage);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-settings-page': DsSettingsPage;
  }
}
