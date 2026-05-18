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
 * responsive height (48px below the desktop breakpoint, 56px on desktop) and a
 * symmetric 16px inline padding.
 *
 * @slot brand - Logo, wordmark, and/or page title (left).
 * @slot actions - Buttons, account menus, drawer toggle, etc. (right).
 * @csspart bar - The internal `<nav>` landmark element.
 * @csspart brand - The brand wrapper.
 * @csspart actions - The actions wrapper.
 * @cssprop --ds-top-bar-bg - Background color of the bar. Defaults to `var(--ds-color-bg)`.
 *   Override (e.g. to `transparent`) when nesting inside a container that paints its own
 *   background underneath, such as a sticky shell with `backdrop-filter`.
 */
export class DsTopBar extends DsElement {
  static override styles = [...DsElement.styles, topBarStyles];

  @property() label = 'Primary';

  override render(): TemplateResult {
    return html`<nav part="bar" aria-label=${this.label}>
      <div class="brand" part="brand"><slot name="brand"></slot></div>
      <div class="actions" part="actions"><slot name="actions"></slot></div>
    </nav>`;
  }
}
