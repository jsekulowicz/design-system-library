import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { DsElement } from '@jsekulowicz/ds-core';
import type { AriaBoolean, AriaChecked, AriaHasPopup, AriaInvalid, AriaRole, LinkTarget } from '@jsekulowicz/ds-core';
import { spinnerStyles } from '../../shared/spinner.js';
import { buttonContent } from './button-content.js';
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
 * @attr {string} loading-label - Label shown while loading. Pins the button to the wider of the two states.
 * @attr {string} href - Renders an `<a>` instead of a `<button>`, so a button-shaped link is one tab stop.
 * @csspart button - The internal `<button>`, or the `<a>` when `href` is set.
 * @csspart spinner - The loading spinner SVG.
 * @cssprop --ds-button-bg - Primary variant background.
 * @cssprop --ds-button-fg - Primary variant foreground.
 * @cssprop --ds-button-bg-hover - Primary hover background; derived from background and foreground by default.
 * @cssprop --ds-button-bg-active - Primary active background; derived from background and foreground by default.
 * @cssprop --ds-spinner-size - Loading spinner diameter. With `loading-label`, defaults to ds-icon's `lg` size so the label does not shift; override it when the leading icon is a different size.
 * @cssprop --ds-button-solid - Legacy primary background override.
 * @cssprop --ds-button-solid-hover - Legacy primary hover background override.
 * @cssprop --ds-button-solid-active - Legacy primary active background override.
 * @cssprop --ds-button-on-solid - Legacy primary foreground override.
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
  @property() href?: string;
  @property() target?: LinkTarget;
  @property() rel?: string;
  @property({ attribute: 'aria-controls' }) ariaControlsAttr?: string;
  @property({ attribute: 'aria-expanded' }) ariaExpandedAttr?: AriaBoolean;
  @property({ attribute: 'aria-haspopup' }) ariaHasPopupAttr?: AriaHasPopup;
  @property({ attribute: 'aria-invalid' }) ariaInvalidAttr?: AriaInvalid;
  // Bound onto the inner <button>, never the host: a host tabindex would add a stray tab stop.
  @property({ attribute: 'role' }) roleAttr?: AriaRole;
  @property({ attribute: 'aria-checked' }) ariaCheckedAttr?: AriaChecked;
  @property({ attribute: false }) tabIndexAttr?: number;

  override focus(options?: FocusOptions): void {
    this.renderRoot.querySelector<HTMLElement>('.btn')?.focus(options);
  }

  #handleClick = (event: MouseEvent): void => {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    if (this.href === undefined && (this.type === 'submit' || this.type === 'reset')) {
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

  #isInoperable(): boolean {
    return this.disabled || this.loading;
  }

  #renderButton(): TemplateResult {
    return html`
      <button
        part="button"
        class="btn ds-focus-ring"
        type=${this.type}
        role=${ifDefined(this.roleAttr)}
        tabindex=${ifDefined(this.tabIndexAttr)}
        aria-disabled=${this.#isInoperable() ? 'true' : 'false'}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-checked=${ifDefined(this.ariaCheckedAttr)}
        aria-controls=${ifDefined(this.ariaControlsAttr)}
        aria-expanded=${ifDefined(this.ariaExpandedAttr)}
        aria-haspopup=${ifDefined(this.ariaHasPopupAttr)}
        aria-invalid=${ifDefined(this.ariaInvalidAttr)}
        aria-label=${ifDefined(this.label)}
        @click=${this.#handleClick}
      >
        ${buttonContent(this.loading, this.loadingLabel)}
      </button>
    `;
  }

  #renderLink(): TemplateResult {
    return html`
      <a
        part="button"
        class="btn ds-focus-ring"
        href=${ifDefined(this.href)}
        target=${ifDefined(this.target)}
        rel=${ifDefined(this.rel)}
        role=${ifDefined(this.roleAttr)}
        tabindex=${ifDefined(this.tabIndexAttr)}
        aria-disabled=${this.#isInoperable() ? 'true' : 'false'}
        aria-busy=${this.loading ? 'true' : 'false'}
        aria-controls=${ifDefined(this.ariaControlsAttr)}
        aria-expanded=${ifDefined(this.ariaExpandedAttr)}
        aria-haspopup=${ifDefined(this.ariaHasPopupAttr)}
        aria-label=${ifDefined(this.label)}
        @click=${this.#handleClick}
      >
        ${buttonContent(this.loading, this.loadingLabel)}
      </a>
    `;
  }

  override render(): TemplateResult {
    return this.href === undefined ? this.#renderButton() : this.#renderLink();
  }
}
