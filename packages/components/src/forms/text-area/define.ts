import { defineCustomElement } from '../../registration.js';
import { DsTextArea } from './text-area.js';

defineCustomElement('ds-text-area', DsTextArea);

declare global {
  interface HTMLElementTagNameMap {
    'ds-text-area': DsTextArea;
  }
}
