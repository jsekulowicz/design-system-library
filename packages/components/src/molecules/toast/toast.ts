import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { toastStyles } from './toast.styles.js';

export type ToastTone = 'info' | 'success' | 'warning' | 'danger';
export type ToastDismissReason = 'timeout' | 'user' | 'programmatic';

const DEFAULT_DURATION_BY_TONE: Record<ToastTone, number> = {
  info: 5000,
  success: 5000,
  warning: 8000,
  danger: 0,
};

/**
 * @tag ds-toast
 * @summary Transient notification rendered inside a `ds-toast-stack`. Auto-dismisses on a tone-aware timer; pauses on hover and focus.
 * @slot default - Body text.
 * @slot actions - Optional action row (e.g. an Undo button).
 * @csspart toast - The internal toast container.
 * @event ds-dismiss - Fires when the toast is removed. Detail: `{ reason: 'timeout' | 'user' | 'programmatic' }`.
 */
export class DsToast extends DsElement {
  static override styles = [...DsElement.styles, toastStyles];

  @property({ reflect: true }) tone: ToastTone = 'info';
  @property() heading?: string;
  @property({ type: Number }) duration?: number;
  @property({ type: Boolean, reflect: true }) dismissible = true;

  #timer = 0;
  #remaining = 0;
  #startedAt = 0;
  #hovered = false;
  #focused = false;
  #dismissed = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener('mouseenter', this.#onMouseEnter);
    this.addEventListener('mouseleave', this.#onMouseLeave);
    this.addEventListener('focusin', this.#onFocusIn);
    this.addEventListener('focusout', this.#onFocusOut);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#clearTimer();
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('tone')) {
      this.setAttribute('role', this.tone === 'danger' ? 'alert' : 'status');
      this.setAttribute('aria-live', this.tone === 'danger' ? 'assertive' : 'polite');
    }
    if (changed.has('tone') || changed.has('duration')) {
      this.#startTimer();
    }
  }

  /** The effective auto-dismiss duration: explicit `duration`, or the default for the current tone. */
  get effectiveDuration(): number {
    return this.duration ?? DEFAULT_DURATION_BY_TONE[this.tone];
  }

  dismiss(reason: ToastDismissReason = 'programmatic'): void {
    if (this.#dismissed) return;
    this.#dismissed = true;
    this.#clearTimer();
    this.emit('ds-dismiss', { detail: { reason } });
    this.remove();
  }

  #startTimer = (): void => {
    this.#clearTimer();
    if (this.effectiveDuration <= 0) return;
    this.#remaining = this.effectiveDuration;
    if (this.#hovered || this.#focused) return;
    this.#startedAt = Date.now();
    this.#timer = window.setTimeout(() => this.dismiss('timeout'), this.#remaining);
  };

  #clearTimer = (): void => {
    if (this.#timer) {
      window.clearTimeout(this.#timer);
      this.#timer = 0;
    }
  };

  #pauseTimer = (): void => {
    if (!this.#timer) return;
    const elapsed = Date.now() - this.#startedAt;
    this.#remaining = Math.max(0, this.#remaining - elapsed);
    this.#clearTimer();
  };

  #resumeTimer = (): void => {
    if (this.#timer || this.#remaining <= 0 || this.effectiveDuration <= 0) return;
    if (this.#hovered || this.#focused) return;
    this.#startedAt = Date.now();
    this.#timer = window.setTimeout(() => this.dismiss('timeout'), this.#remaining);
  };

  #onMouseEnter = (): void => {
    this.#hovered = true;
    this.#pauseTimer();
  };

  #onMouseLeave = (): void => {
    this.#hovered = false;
    this.#resumeTimer();
  };

  #onFocusIn = (): void => {
    this.#focused = true;
    this.#pauseTimer();
  };

  #onFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && this.contains(next)) return;
    this.#focused = false;
    this.#resumeTimer();
  };

  #onDismissClick = (): void => this.dismiss('user');

  override render(): TemplateResult {
    return html`<div class="toast" part="toast">
      <div class="content">
        ${this.heading ? html`<div class="title" part="title">${this.heading}</div>` : nothing}
        <slot></slot>
      </div>
      <slot name="actions"></slot>
      ${this.dismissible
        ? html`<button class="close" type="button" aria-label="Dismiss" @click=${this.#onDismissClick}>
            <svg viewBox="0 0 16 16" width="14" height="14" fill="none" aria-hidden="true">
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
              />
            </svg>
          </button>`
        : nothing}
    </div>`;
  }
}
