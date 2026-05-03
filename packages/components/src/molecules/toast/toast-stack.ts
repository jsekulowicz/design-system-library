import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { toastStackStyles } from './toast-stack.styles.js';
import type { DsToast } from './toast.js';

export type ToastPlacement = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

/**
 * @tag ds-toast-stack
 * @summary A fixed-position queue of `ds-toast` elements. One stack per placement.
 * @slot default - `ds-toast` children. New toasts can also be added via `push()`.
 */
export class DsToastStack extends DsElement {
  static override styles = [...DsElement.styles, toastStackStyles];

  @property({ reflect: true }) placement: ToastPlacement = 'bottom-right';
  @property({ type: Number }) max = 5;
  @property() label = 'Notifications';

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'region');
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) this.setAttribute('aria-label', this.label);
  }

  /** Append a toast and enforce the `max` cap. */
  push(toast: DsToast): void {
    this.appendChild(toast);
    this.#enforceMax();
  }

  #enforceMax = (): void => {
    const toasts = Array.from(this.children).filter(
      (child) => child.tagName.toLowerCase() === 'ds-toast',
    ) as DsToast[];
    let extra = toasts.length - this.max;
    let i = 0;
    while (extra > 0 && i < toasts.length) {
      toasts[i]?.dismiss('programmatic');
      i += 1;
      extra -= 1;
    }
  };

  override render(): TemplateResult {
    return html`<slot @slotchange=${this.#enforceMax}></slot>`;
  }
}
