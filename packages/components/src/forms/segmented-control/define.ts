import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import '../../data-display/icon/define.js';
import { DsSegmentedControl } from './segmented-control.js';

defineCustomElement('ds-segmented-control', DsSegmentedControl);

declare global {
  interface HTMLElementTagNameMap {
    'ds-segmented-control': DsSegmentedControl;
  }
}
