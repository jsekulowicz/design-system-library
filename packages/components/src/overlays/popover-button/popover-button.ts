import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property, query, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { PopoverController, syncPopoverPanel } from '../../shared/popover-controller.js';
import { SlottedTriggerController } from '../../shared/slotted-trigger.js';
import { popoverButtonStyles } from './popover-button.styles.js';
import type { ButtonSize, ButtonVariant } from '../../actions/button/button.js';
import type { PopoverPlacement } from '../../shared/popover-placement.js';

const PANEL_ID = 'panel';

/**
 * @tag ds-popover-button
 * @summary Trigger-controlled neutral popover panel for arbitrary interactive content.
 * @slot trigger - Optional custom trigger.
 * @slot default - Popover panel content.
 * @csspart trigger - Default trigger button.
 * @csspart panel - Popover panel.
 * @event ds-open - Fires when the popover opens.
 * @event ds-close - Fires when the popover closes.
 */
export class DsPopoverButton extends DsElement {
  static override styles = [...DsElement.styles, popoverButtonStyles];

  @property() label = '';
  @property() variant: ButtonVariant = 'secondary';
  @property() size: ButtonSize = 'md';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ reflect: true }) placement: PopoverPlacement = 'bottom-start';
  @property({ type: Boolean, reflect: true }) open = false;

  @state() private _hasTriggerSlot = false;

  @query('#trigger') private _triggerEl?: HTMLElement;
  @query(`#${PANEL_ID}`) private _panelEl?: HTMLElement;

  #popover = new PopoverController(this, {
    focusTrigger: () => this.#focusTrigger(),
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
    onTriggerKeydown: this.#popover.onEscapeKeydown,
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
        this.#popover.show();
      } else {
        this.#popover.hide();
      }
    }
  }

  override updated(): void {
    this.#slottedTrigger.syncAria(PANEL_ID);
    syncPopoverPanel(this._panelEl, this.#popover.open);
  }

  #focusTrigger(): void {
    if (this._hasTriggerSlot) {
      this.#slottedTrigger.focus();
      return;
    }
    const inner = this._triggerEl?.shadowRoot?.querySelector<HTMLButtonElement>('button');
    (inner ?? this._triggerEl)?.focus();
  }

  #onClick = (): void => {
    if (!this.disabled) {
      this.#popover.toggle();
    }
  };

  override render(): TemplateResult {
    return html`<div class="control-wrap" @keydown=${this.#popover.onEscapeKeydown}>
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
      aria-expanded=${this.#popover.open ? 'true' : 'false'}
      aria-controls=${ifDefined(this.#popover.open ? PANEL_ID : undefined)}
      @ds-click=${this.#onClick}
      @keydown=${this.#popover.onEscapeKeydown}
    >
      ${this.label}
    </ds-button>`;
  }

  #renderPanel(): TemplateResult {
    return html`<div id=${PANEL_ID} class="panel" part="panel" popover="manual"><slot></slot></div>`;
  }
}
