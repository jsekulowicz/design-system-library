import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { buttonStyles } from './button.styles.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * @tag ds-button
 * @summary Primary action trigger with variants and sizes.
 * @slot default - The button label.
 * @slot leading - Icon or adornment rendered before the label.
 * @slot trailing - Icon or adornment rendered after the label.
 * @csspart button - The internal `<button>` element.
 * @event ds-click - Emitted when the button is activated.
 */
export class DsButton extends DsElement {
  static override styles = [...DsElement.styles, buttonStyles];

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) size: ButtonSize = 'md';
  @property({ reflect: true }) type: ButtonType = 'button';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false;
  @property({ type: Boolean, reflect: true }) responsive = false;
  @property() label?: string;

  #handleClick = (event: MouseEvent): void => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (this.type === 'submit' || this.type === 'reset') {
      this.#submitHostForm();
    }
    this.emit('ds-click', { detail: { originalEvent: event } });
  };

  #submitHostForm(): void {
    const form = this.closest('form');
    if (!form) {
      return;
    }
    if (this.type === 'submit') {
      form.requestSubmit();
    } else {
      form.reset();
    }
  }

  override render(): TemplateResult {
    const busy = this.loading ? 'true' : 'false';
    return html`
      <button
        part="button"
        class="btn ds-focus-ring"
        type=${this.type}
        ?disabled=${this.disabled || this.loading}
        aria-busy=${busy}
        aria-label=${this.label ?? ''}
        @click=${this.#handleClick}
      >
        <slot name="leading"></slot>
        <slot></slot>
        <slot name="trailing"></slot>
      </button>
    `;
  }
}
