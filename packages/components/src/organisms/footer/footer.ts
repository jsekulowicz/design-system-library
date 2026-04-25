import { html, type TemplateResult } from 'lit';
import { DsElement } from '@ds/core';
import { footerStyles } from './footer.styles.js';

/**
 * @tag ds-footer
 * @summary Slots-only page footer. Lays out start / middle / end regions; wraps to a column on narrow widths.
 * @slot start - Left region. Typical use: copyright text.
 * @slot default - Middle region.
 * @slot end - Right region. Typical use: nav links, social icons.
 * @csspart root - The internal `<footer>` element.
 * @csspart start - The start region wrapper.
 * @csspart middle - The middle region wrapper.
 * @csspart end - The end region wrapper.
 */
export class DsFooter extends DsElement {
  static override styles = [...DsElement.styles, footerStyles];

  override render(): TemplateResult {
    return html`<footer part="root">
      <div class="start" part="start"><slot name="start"></slot></div>
      <div class="middle" part="middle"><slot></slot></div>
      <div class="end" part="end"><slot name="end"></slot></div>
    </footer>`;
  }
}
