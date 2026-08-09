import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement } from '@jsekulowicz/ds-core';
import type { AriaBoolean, AriaChecked, AriaHasPopup, AriaInvalid, AriaRole } from '@jsekulowicz/ds-core';
import { spinnerStyles, spinnerTemplate } from '../../shared/spinner.js';
import { buttonStyles } from './button.styles.js';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonColor = 'accent' | 'success' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * @tag ds-button
 * @summary Primary action trigger with variants and sizes.
 * @slot default - The button label.
 * @slot leading - Icon or adornment rendered before the label.
 * @slot trailing - Icon or adornment rendered after the label.
 * @attr {boolean} square - Forces an icon-sized square button and ignores the text-button min width.
 * @attr {string} loading-label - Text shown in place of the label while loading. Setting it
 *   pins the button width to the wider of the two states so the label swap never reflows.
 *   Without it the spinner is an overlay, so `loading` never changes the button's size either.
 * @csspart button - The internal `<button>` element.
 * @csspart spinner - The loading spinner SVG.
 * @cssprop --ds-spinner-size - Loading spinner diameter.
 * @cssprop --ds-button-solid - Primary variant background.
 * @cssprop --ds-button-solid-hover - Primary variant hover background.
 * @cssprop --ds-button-solid-active - Primary variant active background.
 * @cssprop --ds-button-on-solid - Text color on the solid background.
 * @cssprop --ds-button-line - Secondary variant border color.
 * @cssprop --ds-button-text - Secondary/ghost variant text color.
 * @event ds-click - Emitted when the button is activated.
 */
export class DsButton extends DsElement {
  static override styles = [...DsElement.styles, spinnerStyles, buttonStyles];

  @property({ reflect: true }) variant: ButtonVariant = 'primary';
  @property({ reflect: true }) color: ButtonColor = 'accent';
  @property({ reflect: true }) size: ButtonSize = 'md';
  @property({ reflect: true }) type: ButtonType = 'button';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ type: Boolean, reflect: true, attribute: 'full-width' }) fullWidth = false;
  @property({ type: Boolean, reflect: true }) square = false;
  @property() label?: string;
  @property({ attribute: 'loading-label' }) loadingLabel?: string;
  @property({ attribute: 'aria-controls' }) ariaControlsAttr?: string;
  @property({ attribute: 'aria-expanded' }) ariaExpandedAttr?: AriaBoolean;
  @property({ attribute: 'aria-haspopup' }) ariaHasPopupAttr?: AriaHasPopup;
  @property({ attribute: 'aria-invalid' }) ariaInvalidAttr?: AriaInvalid;
  // Bound onto the inner <button>, never the host: a host tabindex would add a stray tab stop.
  @property({ attribute: 'role' }) roleAttr?: AriaRole;
  @property({ attribute: 'aria-checked' }) ariaCheckedAttr?: AriaChecked;
  @property({ attribute: false }) tabIndexAttr?: number;

  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector<HTMLButtonElement>('button')?.focus(options);
  }

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
    const form = this.closest('form') ?? this.#findShadowForm();
    if (!form) {
      return;
    }
    if (this.type === 'submit') {
      form.requestSubmit();
    } else {
      form.reset();
    }
  }

  #findShadowForm(): HTMLFormElement | null {
    const host = this.closest('ds-form');
    return host?.shadowRoot?.querySelector('form') ?? null;
  }

  override render(): TemplateResult {
    return html`
      <button
        part="button"
        class="btn ds-focus-ring"
        type=${this.type}
        role=${ifDefined(this.roleAttr)}
        tabindex=${ifDefined(this.tabIndexAttr)}
        aria-disabled=${this.disabled || this.loading ? 'true' : 'false'}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-checked=${ifDefined(this.ariaCheckedAttr)}
        aria-controls=${ifDefined(this.ariaControlsAttr)}
        aria-expanded=${ifDefined(this.ariaExpandedAttr)}
        aria-haspopup=${ifDefined(this.ariaHasPopupAttr)}
        aria-invalid=${ifDefined(this.ariaInvalidAttr)}
        aria-label=${ifDefined(this.label)}
        @click=${this.#handleClick}
      >
        ${this.loadingLabel ? this.#renderLabelStack() : this.#renderPlainContent()}
      </button>
    `;
  }

  // Overlay, not a flex item: inline space would resize the button on load.
  #renderPlainContent(): TemplateResult {
    return html`
      <span class="content ${this.loading ? 'is-hidden' : ''}">
        <slot name="leading"></slot>
        <slot></slot>
        <slot name="trailing"></slot>
      </span>
      ${this.loading ? html`<span class="loading-overlay">${spinnerTemplate()}</span>` : nothing}
    `;
  }

  // A loading label stays in flow; one grid cell sizes to the wider state.
  #renderLabelStack(): TemplateResult {
    return html`
      <span class="stack labels">
        <span
          class="stack-item ${this.loading ? 'is-hidden' : ''}"
          aria-hidden=${ifDefined(this.loading ? 'true' : undefined)}
        >
          <slot name="leading"></slot>
          <slot></slot>
        </span>
        <span
          class="stack-item ${this.loading ? '' : 'is-hidden'}"
          aria-hidden=${ifDefined(this.loading ? undefined : 'true')}
        >
          ${spinnerTemplate(this.loading ? '' : 'is-hidden')} ${this.loadingLabel}
        </span>
      </span>
      <slot name="trailing"></slot>
    `;
  }
}
