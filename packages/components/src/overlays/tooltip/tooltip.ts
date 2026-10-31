import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { SlotPresenceController } from '../../shared/slot-presence.js';
import { tooltipStyles } from './tooltip.styles.js';
import { hideTooltipPopover, showTooltipPopover } from './tooltip-popover.js';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type TooltipTrigger = 'auto' | 'manual';

const TIP_SLOT = 'tip';

/**
 * @tag ds-tooltip
 * @summary Contextual label that appears on hover/focus of the trigger element. Escape hides a tip shown by hover or focus until the pointer or focus next enters; one held up by `open` stays.
 * @attr {boolean} inline - Lets a text trigger wrap with the sentence around it, in that sentence's font and color. Whitespace left after the trigger in the default slot renders too, so put the tip slot first.
 * @attr {'auto' | 'manual'} trigger - Automatic hover/focus behavior by default; manual makes `open` the sole visibility control and leaves Escape to the host.
 * @slot default - The trigger element that the tooltip is anchored to.
 * @slot tip - The tooltip content (can be any HTML).
 * @csspart anchor - The wrapper around the trigger element.
 * @csspart tooltip - The tooltip bubble. Rendered in the Popover API top layer so it escapes ancestor overflow; positioned with CSS anchor positioning relative to the trigger.
 * @cssprop [--ds-tooltip-max-width=24rem] - Maximum tooltip width before the viewport safety cap applies.
 * @cssprop [--ds-tooltip-padding=var(--ds-space-1) var(--ds-space-3)] - Padding inside the bubble. The default is tuned for a one-line hint; set it square for a tip holding a panel of content.
 */
export class DsTooltip extends DsElement {
  static override styles = [...DsElement.styles, tooltipStyles];

  readonly #slots = new SlotPresenceController(this, [TIP_SLOT]);

  @property({ reflect: true }) trigger: TooltipTrigger = 'auto';
  @property({ reflect: true }) placement: TooltipPlacement = 'top';
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, attribute: 'hover-only' }) hoverOnly = false;
  @property({ type: Number }) delay = 0;
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false;
  @property({ type: Boolean, reflect: true }) inline = false;

  @state() private _hovered = false;
  @state() private _focused = false;
  @state() private _dismissedByEscape = false;
  @state() private _selectionHeld = false;

  private _hoverTimer?: number;

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearHoverTimer();
    this.#releaseSelection();
    this.#listenForEscapeWhile(false);
    hideTooltipPopover(this.#tooltipEl());
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('trigger')) {
      this.#clearHoverTimer();
      this.#releaseSelection();
      this._hovered = false;
      this._focused = false;
      this._dismissedByEscape = false;
    }
  }

  override updated(): void {
    const showsTransiently = this.#showsTransiently();
    if (this.#hasTip() && (this.open || this._selectionHeld || showsTransiently)) {
      showTooltipPopover(this.#tooltipEl());
    } else {
      hideTooltipPopover(this.#tooltipEl());
    }
    this.#listenForEscapeWhile(showsTransiently || this._selectionHeld);
  }

  #hasTip(): boolean {
    return this.#slots.has(TIP_SLOT);
  }

  #showsTransiently(): boolean {
    return (
      this.trigger !== 'manual' &&
      this.#hasTip() &&
      !this._dismissedByEscape &&
      (this._hovered || (!this.hoverOnly && this._focused))
    );
  }

  #listenForEscapeWhile(listening: boolean): void {
    if (listening) {
      document.addEventListener('keydown', this.#dismissOnEscape);
    } else {
      document.removeEventListener('keydown', this.#dismissOnEscape);
    }
  }

  #dismissOnEscape = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this._dismissedByEscape = true;
      this.#releaseSelection();
    }
  };

  #releaseOnOutsidePointer = (event: PointerEvent): void => {
    if (!event.composedPath().includes(this)) {
      this.#releaseSelection();
    }
  };

  #releaseSelection = (): void => {
    this._selectionHeld = false;
    document.removeEventListener('pointerdown', this.#releaseOnOutsidePointer);
  };

  #holdSelection = (event: PointerEvent): void => {
    if (this.trigger === 'manual' || event.button !== 0) {
      return;
    }
    this._selectionHeld = true;
    document.addEventListener('pointerdown', this.#releaseOnOutsidePointer);
  };

  #stopTipClick = (event: MouseEvent): void => {
    event.stopPropagation();
  };

  #clearHoverTimer = (): void => {
    if (this._hoverTimer !== undefined) {
      window.clearTimeout(this._hoverTimer);
      this._hoverTimer = undefined;
    }
  };

  #onMouseEnter = (): void => {
    if (this.trigger === 'manual') {
      return;
    }
    this.#clearHoverTimer();
    this._dismissedByEscape = false;
    if (this.delay > 0) {
      this._hoverTimer = window.setTimeout(() => {
        this._hovered = true;
      }, this.delay);
    } else {
      this._hovered = true;
    }
  };

  #onMouseLeave = (): void => {
    if (this.trigger === 'manual') {
      return;
    }
    this.#clearHoverTimer();
    this._hovered = false;
  };

  #onFocusIn = (): void => {
    if (this.trigger === 'manual' || this.hoverOnly) {
      return;
    }
    this._dismissedByEscape = false;
    this._focused = true;
  };

  #onFocusOut = (): void => {
    if (this.trigger === 'manual' || this.hoverOnly) {
      return;
    }
    this._focused = false;
  };

  #tooltipEl(): Element | null {
    return this.shadowRoot?.querySelector('.tooltip') ?? null;
  }

  override render(): TemplateResult {
    return html`<span
      class="anchor"
      part="anchor"
      @mouseenter=${this.#onMouseEnter}
      @mouseleave=${this.#onMouseLeave}
      @focusin=${this.#onFocusIn}
      @focusout=${this.#onFocusOut}
      ><slot></slot
      ><span
        role="tooltip"
        part="tooltip"
        class="tooltip"
        popover="manual"
        @pointerdown=${this.#holdSelection}
        @click=${this.#stopTipClick}
        ><slot name="tip" @slotchange=${this.#slots.handleSlotChange}></slot></span
    ></span>`;
  }
}
