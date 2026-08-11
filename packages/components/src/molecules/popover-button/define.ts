import { DsPopoverButton } from './popover-button.js';

export { DsPopoverButton };

if (!customElements.get('ds-popover-button')) {
  customElements.define('ds-popover-button', DsPopoverButton);
}

declare global {
  interface HTMLElementTagNameMap {
    'ds-popover-button': DsPopoverButton;
  }
}
