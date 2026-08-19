import { defineCustomElement } from '../../registration.js';
import '../button/define.js';
import '../icon/define.js';
import { DsSegmentedControl } from './segmented-control.js';

defineCustomElement('ds-segmented-control', DsSegmentedControl);

declare global {
  interface HTMLElementTagNameMap {
    'ds-segmented-control': DsSegmentedControl;
  }
}
