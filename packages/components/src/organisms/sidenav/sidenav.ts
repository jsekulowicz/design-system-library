import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { sidenavStyles } from './sidenav.styles.js';

const COMPACT_TARGETS = 'ds-nav-item, ds-nav-group';

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

  @state() private _hasHeader = false;
  @state() private _hasFooter = false;

  override updated(changed: PropertyValues): void {
    if (changed.has('collapsed')) {
      this.#syncCompact();
    }
  }

  #syncCompact(): void {
    const targets = this.querySelectorAll<HTMLElement>(COMPACT_TARGETS);
    targets.forEach((el) => {
      el.toggleAttribute('compact', this.collapsed);
    });
  }

  #onHeaderSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasHeader = slot.assignedNodes({ flatten: true }).length > 0;
  }

  #onFooterSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    this._hasFooter = slot.assignedNodes({ flatten: true }).length > 0;
  }

  #onDefaultSlotChange = (): void => {
    this.#syncCompact();
  };

  override render(): TemplateResult {
    return html`<nav part="nav" aria-label=${this.label}>
      <div class="header" part="header" ?hidden=${!this._hasHeader}>
        <slot name="header" @slotchange=${this.#onHeaderSlotChange}></slot>
      </div>
      <div class="list" part="list" role="list">
        <slot @slotchange=${this.#onDefaultSlotChange}></slot>
      </div>
      <div class="footer" part="footer" ?hidden=${!this._hasFooter}>
        <slot name="footer" @slotchange=${this.#onFooterSlotChange}></slot>
      </div>
    </nav>`;
  }
}
