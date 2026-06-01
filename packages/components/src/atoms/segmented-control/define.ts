import { DsSegmentedControl } from './segmented-control.js';

if (!customElements.get('ds-segmented-control')) {
  customElements.define('ds-segmented-control', DsSegmentedControl);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-segmented-control': DsSegmentedControl;
  }
}
