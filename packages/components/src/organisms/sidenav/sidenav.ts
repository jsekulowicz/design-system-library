import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { sidenavStyles } from './sidenav.styles.js';

/**
 * @tag ds-sidenav
 * @summary Vertical sidebar navigation. Hosts ds-nav-item / ds-nav-group children. Supports an icon-only collapsed mode.
 * @slot header - Logo / app name (top).
 * @slot default - ds-nav-item and ds-nav-group children.
 * @slot footer - Bottom region (settings, sign-out, theme toggle, etc.).
 * @csspart nav - The internal `<nav>` element.
 * @csspart header - The header wrapper.
 * @csspart list - The default-slot list wrapper.
 * @csspart footer - The footer wrapper.
 */
export class DsSidenav extends DsElement {
  static override styles = [...DsElement.styles, sidenavStyles];

  @property() label = 'Secondary';
  @property({ type: Boolean, reflect: true }) collapsed = false;

  override render(): TemplateResult {
    return html`<nav part="nav" aria-label=${this.label}>
      <div class="header" part="header"><slot name="header"></slot></div>
      <div class="list" part="list" role="list"><slot></slot></div>
      <div class="footer" part="footer"><slot name="footer"></slot></div>
    </nav>`;
  }
}
