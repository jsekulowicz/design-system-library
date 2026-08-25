import { defineCustomElement } from '../../registration.js';
import { DsProgressBar } from './progress-bar.js';

defineCustomElement('ds-progress-bar', DsProgressBar);

declare global {
  interface HTMLElementTagNameMap {
    'ds-progress-bar': DsProgressBar;
  }
}
