import { DsProgressBar } from './progress-bar.js';

if (!customElements.get('ds-progress-bar')) {
  customElements.define('ds-progress-bar', DsProgressBar);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-progress-bar': DsProgressBar;
  }
}
