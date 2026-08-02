import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
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
  @property({ attribute: 'aria-expanded' }) ariaExpandedAttr?: string;
  @property({ attribute: 'aria-haspopup' }) ariaHasPopupAttr?: string;
  @property({ attribute: 'aria-invalid' }) ariaInvalidAttr?: string;
  // Let a parent repurpose the focusable element as a radio/tab/menuitem and
  // drive roving tabindex (e.g. ds-segmented-control). Bound as properties so
  // the role/state/tabindex land on the inner <button>, never duplicated onto
  // the host (a host tabindex would add a second, stray tab stop).
  @property({ attribute: 'role' }) roleAttr?: string;
  @property({ attribute: 'aria-checked' }) ariaCheckedAttr?: string;
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
        role=${this.roleAttr ?? nothing}
        tabindex=${this.tabIndexAttr ?? nothing}
        aria-disabled=${this.disabled || this.loading ? 'true' : 'false'}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-checked=${this.ariaCheckedAttr ?? nothing}
        aria-controls=${this.ariaControlsAttr ?? nothing}
        aria-expanded=${this.ariaExpandedAttr ?? nothing}
        aria-haspopup=${this.ariaHasPopupAttr ?? nothing}
        aria-invalid=${this.ariaInvalidAttr ?? nothing}
        aria-label=${this.label ?? nothing}
        @click=${this.#handleClick}
      >
        ${this.loadingLabel ? this.#renderLabelStack() : this.#renderPlainContent()}
      </button>
    `;
  }

  // The spinner never joins the flex row: it is an overlay centred on the button,
  // and the content it covers only loses its visibility. Letting it take inline
  // space is what used to widen the button by a gap plus the spinner box (or, with
  // a leading icon, by the difference between the two) the instant loading began.
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

  // A loading label has to be readable, so it stays in flow. Both states share one
  // grid cell instead, making the box as wide as the wider of the two in either
  // state -- the swap is then a pure visibility change.
  #renderLabelStack(): TemplateResult {
    return html`
      <span class="stack labels">
        <span
          class="stack-item ${this.loading ? 'is-hidden' : ''}"
          aria-hidden=${this.loading ? 'true' : nothing}
        >
          <slot name="leading"></slot>
          <slot></slot>
        </span>
        <span
          class="stack-item ${this.loading ? '' : 'is-hidden'}"
          aria-hidden=${this.loading ? nothing : 'true'}
        >
          ${spinnerTemplate(this.loading ? '' : 'is-hidden')} ${this.loadingLabel}
        </span>
      </span>
      <slot name="trailing"></slot>
    `;
  }
}
