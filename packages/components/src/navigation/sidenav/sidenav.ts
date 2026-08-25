import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { sidenavStyles } from './sidenav.styles.js';
import { scrollFadeStyles } from '../../shared/scroll-fade.styles.js';
import { ScrollFadeController } from '../../shared/scroll-fade-controller.js';
import { SlotPresenceController } from '../../shared/slot-presence.js';

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
  static override styles = [...DsElement.styles, scrollFadeStyles, sidenavStyles];

  @property() label = 'Secondary';
  @property({ type: Boolean, reflect: true }) collapsed = false;

  readonly #slots = new SlotPresenceController(this, ['header', 'footer']);

  private readonly _scrollFade = new ScrollFadeController(this, () => this.shadowRoot?.querySelector('nav'));

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

  #onDefaultSlotChange = (): void => {
    this.#syncCompact();
  };

  override render(): TemplateResult {
    return html`<nav class="scroll-fade" part="nav" aria-label=${this.label}>
      <div class="header" part="header" ?hidden=${!this.#slots.has('header')}>
        <slot name="header" @slotchange=${this.#slots.handleSlotChange}></slot>
      </div>
      <div class="list" part="list" role="list">
        <slot @slotchange=${this.#onDefaultSlotChange}></slot>
      </div>
      <div class="footer" part="footer" ?hidden=${!this.#slots.has('footer')}>
        <slot name="footer" @slotchange=${this.#slots.handleSlotChange}></slot>
      </div>
    </nav>`;
  }
}
