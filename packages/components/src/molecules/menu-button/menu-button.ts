import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../../atoms/button/define.js';
import '../../atoms/menu/define.js';
import { MenuButtonPopover } from './menu-button-popover.js';
import { SlottedTriggerController } from './slotted-trigger.js';
import { menuButtonStyles } from './menu-button.styles.js';
import type { ButtonSize, ButtonVariant } from '../../atoms/button/button.js';
import type { DsMenuItem } from '../../atoms/menu/menu-item.js';

export type MenuButtonPlacement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

const PANEL_ID = 'panel';

/**
 * @tag ds-menu-button
 * @summary WAI-ARIA menu button: pairs a trigger with `ds-menu` and owns open/close, focus return, and click-outside.
 * @slot trigger - Optional. Override the default `<ds-button>` trigger (e.g. icon-only button or avatar).
 * @slot default - `ds-menu-item` children, forwarded into the inner `<ds-menu>`.
 * @slot header - Forwarded to the inner `<ds-menu>` header slot.
 * @slot footer - Forwarded to the inner `<ds-menu>` footer slot.
 * @csspart trigger - The default trigger button (only rendered when `trigger` slot is empty).
 * @csspart panel - The popover panel.
 * @csspart menu - The inner `<ds-menu>` element.
 * @event ds-select - Bubbles from the inner `<ds-menu>` when an item is activated. Detail: `{ value, originalEvent }`. The menu is closed automatically.
 * @event ds-open - Fires when the menu opens.
 * @event ds-close - Fires when the menu closes.
 */
export class DsMenuButton extends DsElement {
  static override styles = [...DsElement.styles, menuButtonStyles];

  @property() label = '';
  @property() variant: ButtonVariant = 'secondary';
  @property() size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ reflect: true }) placement: MenuButtonPlacement = 'bottom-start';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ attribute: 'menu-label' }) menuLabel = '';

  @state() private _hasTriggerSlot = false;

  @query('#trigger') private triggerEl?: HTMLElement;

  #popover = new MenuButtonPopover(this, {
    focusTrigger: () => this.#focusTrigger(),
    focusFirstItem: () => this.#focusFirstItem(),
    onOpen: () => {
      this.open = true;
      this.emit('ds-open', { detail: {} });
    },
    onClose: () => {
      this.open = false;
      this.emit('ds-close', { detail: {} });
    },
  });

  #slottedTrigger = new SlottedTriggerController({
    isOpen: () => this.#popover.open,
    isDisabled: () => this.disabled,
    toggle: () => this.#popover.toggle(),
    onTriggerKeydown: (event) => this.#popover.onTriggerKeydown(event),
    onSlotChange: (hasTrigger) => {
      this._hasTriggerSlot = hasTrigger;
    },
  });

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#popover.disconnect();
    this.#slottedTrigger.detach();
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('open') && this.open !== this.#popover.open) {
      if (this.open) {
        this.#popover.openMenu();
      } else {
        this.#popover.close();
      }
    }
  }

  override updated(): void {
    this.#slottedTrigger.syncAria(PANEL_ID);
  }

  #focusTrigger(): void {
    if (this._hasTriggerSlot) {
      this.#slottedTrigger.focus();
      return;
    }
    const inner = this.triggerEl?.shadowRoot?.querySelector<HTMLButtonElement>('button');
    (inner ?? this.triggerEl)?.focus();
  }

  #focusFirstItem(): void {
    const item = this.querySelector<DsMenuItem>('ds-menu-item:not([disabled])');
    item?.focus();
  }

  #onDsClick = (): void => {
    if (this.disabled) return;
    this.#popover.toggle();
  };

  #onSelect = (): void => {
    this.#popover.close(true);
  };

  override render(): TemplateResult {
    return html`<div class="control-wrap" @keydown=${this.#popover.onPanelKeydown}>
      ${this.#renderTrigger()} ${this.#popover.open ? this.#renderPanel() : nothing}
    </div>`;
  }

  #renderTrigger(): TemplateResult {
    return html`<div class="trigger-wrap">
      <slot name="trigger" @slotchange=${this.#slottedTrigger.onSlotChange}></slot>
      ${this._hasTriggerSlot ? nothing : this.#renderDefaultTrigger()}
    </div>`;
  }

  #renderDefaultTrigger(): TemplateResult {
    return html`<ds-button
      id="trigger"
      part="trigger"
      variant=${this.variant}
      size=${this.size}
      ?disabled=${this.disabled}
      aria-haspopup="menu"
      aria-expanded=${this.#popover.open ? 'true' : 'false'}
      aria-controls=${this.#popover.open ? PANEL_ID : nothing}
      @ds-click=${this.#onDsClick}
      @keydown=${this.#popover.onTriggerKeydown}
    >
      ${this.label}
    </ds-button>`;
  }

  #renderPanel(): TemplateResult {
    return html`<div id=${PANEL_ID} class="panel" part="panel">
      <ds-menu
        part="menu"
        label=${this.menuLabel || this.label || nothing}
        @ds-select=${this.#onSelect}
      >
        <slot name="header" slot="header"></slot>
        <slot></slot>
        <slot name="footer" slot="footer"></slot>
      </ds-menu>
    </div>`;
  }
}
