import { html, type TemplateResult } from 'lit';
import { DsElement } from '@jsekulowicz/ds-core';
import { footerStyles } from './footer.styles.js';

/**
 * @tag ds-footer
 * @summary Slots-only page footer. Lays out start / middle / end regions; wraps to a column on narrow widths.
 *
 * The visible chrome (border-top + fixed height) always spans the full width of the
 * footer; the inner start / middle / end regions live in a centered `inner` wrapper
 * whose max-width is configurable via the `--ds-footer-content-max-width` custom
 * property, so consumers (e.g. ds-page-shell) can align footer content with a
 * constrained content column above.
 *
 * @slot start - Left region. Typical use: copyright text.
 * @slot default - Middle region.
 * @slot end - Right region. Typical use: nav links, social icons.
 * @csspart root - The internal `<footer>` element (full-width chrome).
 * @csspart inner - The capped content wrapper holding start / middle / end.
 * @csspart start - The start region wrapper.
 * @csspart middle - The middle region wrapper.
 * @csspart end - The end region wrapper.
 * @cssprop --ds-footer-content-max-width - Max width of the inner content
 *   (start + middle + end). Defaults to `none` (no cap). Set to e.g.
 *   `var(--ds-page-shell-max-width)` to align with a content column above.
 */
export class DsFooter extends DsElement {
  static override styles = [...DsElement.styles, footerStyles];

  override render(): TemplateResult {
    return html`<footer part="root">
      <div class="inner" part="inner">
        <div class="start" part="start"><slot name="start"></slot></div>
        <div class="middle" part="middle"><slot></slot></div>
        <div class="end" part="end"><slot name="end"></slot></div>
      </div>
    </footer>`;
  }
}
