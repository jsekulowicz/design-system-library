import { defineCustomElement } from '../../registration.js';
import { DsSettingsPage } from './settings-page.js';

defineCustomElement('ds-settings-page', DsSettingsPage);

declare global {
  interface HTMLElementTagNameMap {
    'ds-settings-page': DsSettingsPage;
  }
}
