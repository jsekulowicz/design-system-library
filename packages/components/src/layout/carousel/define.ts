import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import '../../data-display/icon/define.js';
import { DsCarousel } from './carousel.js';

defineCustomElement('ds-carousel', DsCarousel);

declare global {
  interface HTMLElementTagNameMap {
    'ds-carousel': DsCarousel;
  }
}
