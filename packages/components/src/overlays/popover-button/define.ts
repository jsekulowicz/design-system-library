import { defineCustomElement } from '../../registration.js';
import '../../actions/button/define.js';
import { DsPopoverButton } from './popover-button.js';

export { DsPopoverButton };

defineCustomElement('ds-popover-button', DsPopoverButton);

declare global {
  interface HTMLElementTagNameMap {
    'ds-popover-button': DsPopoverButton;
  }
}
