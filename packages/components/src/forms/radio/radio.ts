import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement, FormControlMixin, hasInteractiveSlottedOrigin } from '@jsekulowicz/ds-core';
import { DEFAULT_SLOT, SlotPresenceController } from '../../shared/slot-presence.js';
import { toggleControlStyles } from '../../shared/toggle-control.styles.js';
import { radioStyles } from './radio.styles.js';

/**
 * @tag ds-radio
 * @summary Single option in a radio group; coordinates via `name` within the same form/root.
 * @slot default - The visible label.
 * @event ds-change - Fires when this radio becomes checked.
 */
export class DsRadio extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, toggleControlStyles, radioStyles];

  readonly #slots = new SlotPresenceController(this, [DEFAULT_SLOT]);

  @property({ type: Boolean, reflect: true }) checked = false;
  @property({ attribute: 'radio-value' }) radioValue = '';
  // Defaults to a normal tab stop so a standalone radio still works outside a group.
  @property({ type: Boolean, attribute: 'tab-stop' }) tabStop = true;

  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector<HTMLInputElement>('input')?.focus(options);
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('checked')) {
      this.value = this.checked ? this.radioValue || 'on' : null;
    }
  }

  #escapeName(value: string): string {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }
    return value.replaceAll('"', '\\"');
  }

  #uncheckSiblings(): void {
    const scope = this.form ?? this.getRootNode();
    if (!(scope instanceof HTMLElement) && !(scope instanceof ShadowRoot) && !(scope instanceof Document)) {
      return;
    }
    const selector = `ds-radio[name="${this.#escapeName(this.name)}"]`;
    const siblings = (scope as Element | ShadowRoot | Document).querySelectorAll<DsRadio>(selector);
    siblings.forEach((sibling) => {
      if (sibling !== this) {
        sibling.checked = false;
      }
    });
  }

  #onInputClick = (event: Event): void => {
    if (this.disabled) {
      event.preventDefault();
    }
  };

  #select = (): void => {
    if (this.disabled || this.checked) {
      return;
    }
    this.checked = true;
    this.#uncheckSiblings();
    this.emit('ds-change', { detail: { value: this.radioValue } });
  };

  #onLabelClick = (event: MouseEvent): void => {
    if (hasInteractiveSlottedOrigin(event, this)) {
      return;
    }
    this.#select();
  };

  #onKey = (event: KeyboardEvent): void => {
    if (event.key !== ' ' && event.key !== 'Enter') {
      return;
    }
    if (hasInteractiveSlottedOrigin(event, this)) {
      return;
    }
    event.preventDefault();
    this.#select();
  };

  override render(): TemplateResult {
    return html`<label
      class=${this.#slots.has(DEFAULT_SLOT) ? 'has-label' : ''}
      @click=${this.#onLabelClick}
      @keydown=${this.#onKey}
    >
      <input
        class="visually-hidden"
        type="radio"
        name=${this.name || ''}
        .checked=${this.checked}
        value=${this.radioValue}
        tabindex=${this.tabStop ? '0' : '-1'}
        ?required=${this.required}
        aria-disabled=${this.disabled ? 'true' : 'false'}
        @click=${this.#onInputClick}
      />
      <span class="control" part="dot" aria-hidden="true"></span>
      <span part="label"><slot @slotchange=${this.#slots.handleSlotChange}></slot></span>
    </label>`;
  }
}
