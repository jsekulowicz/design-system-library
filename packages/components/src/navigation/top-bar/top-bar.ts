import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { topBarStyles } from './top-bar.styles.js';

/**
 * @tag ds-top-bar
 * @summary Application chrome bar with a left brand region and a right actions region.
 *
 * Deliberately minimal: no primary navigation. Pair with `ds-sidenav`.
 * Chrome spans full width; brand and actions sit in a capped, centered wrapper.
 *
 * @slot brand - Logo, wordmark, and/or page title (left).
 * @slot actions - Buttons, account menus, drawer toggle, etc. (right).
 * @csspart bar - The internal `<nav>` landmark element (full-width chrome).
 * @csspart inner - The capped content wrapper holding brand + actions.
 * @csspart brand - The brand wrapper.
 * @csspart actions - The actions wrapper.
 * @cssprop --ds-top-bar-bg - Background color of the bar. Defaults to `var(--ds-color-bg)`.
 *   Set to `transparent` when the container paints its own background.
 * @cssprop --ds-top-bar-content-max-width - Max width of the inner content (brand +
 *   Defaults to `none`. Set to `var(--ds-page-shell-max-width)` to align with the content column.
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
