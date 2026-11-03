import { defineCustomElement } from '../../registration.js';
import '../icon/define.js';
import { DsShareBar } from './share-bar.js';

defineCustomElement('ds-share-bar', DsShareBar);

declare global {
  interface HTMLElementTagNameMap {
    'ds-share-bar': DsShareBar;
  }
}
