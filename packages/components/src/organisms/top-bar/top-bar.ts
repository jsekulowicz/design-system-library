import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { topBarStyles } from './top-bar.styles.js';

/**
 * @tag ds-top-bar
 * @summary Application chrome bar with a left brand region and a right actions region.
 *
 * The bar is intentionally minimal: it does not own primary navigation. Pair it with
 * `ds-sidenav` (typically inside `ds-page-shell`) for navigation. The bar has a fixed
 * 48px height at every viewport and a symmetric 16px inline padding.
 *
 * The visible chrome (background + border-bottom) always spans the full width of the
 * bar; the inner brand + actions content is held in a centered `inner` wrapper whose
 * max-width is configurable via the `--ds-top-bar-content-max-width` custom property,
 * so consumers (e.g. ds-page-shell) can align the bar's content with a constrained
 * content column below.
 *
 * @slot brand - Logo, wordmark, and/or page title (left).
 * @slot actions - Buttons, account menus, drawer toggle, etc. (right).
 * @csspart bar - The internal `<nav>` landmark element (full-width chrome).
 * @csspart inner - The capped content wrapper holding brand + actions.
 * @csspart brand - The brand wrapper.
 * @csspart actions - The actions wrapper.
 * @cssprop --ds-top-bar-bg - Background color of the bar. Defaults to `var(--ds-color-bg)`.
 *   Override (e.g. to `transparent`) when nesting inside a container that paints its own
 *   background underneath, such as a sticky shell with `backdrop-filter`.
 * @cssprop --ds-top-bar-content-max-width - Max width of the inner content (brand +
 *   actions). Defaults to `none` (no cap). Set to e.g. `var(--ds-page-shell-max-width)`
 *   to align with a content column below.
 */
export class DsTopBar extends DsElement {
  static override styles = [...DsElement.styles, topBarStyles];

  @property() label = 'Primary';

  override render(): TemplateResult {
    return html`<nav part="bar" aria-label=${this.label}>
      <div class="inner" part="inner">
        <div class="brand" part="brand"><slot name="brand"></slot></div>
        <div class="actions" part="actions"><slot name="actions"></slot></div>
      </div>
    </nav>`;
  }
}
