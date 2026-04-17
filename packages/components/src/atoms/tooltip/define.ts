import { DsTooltip } from './tooltip.js';

if (!customElements.get('ds-tooltip')) {
  customElements.define('ds-tooltip', DsTooltip);
}
