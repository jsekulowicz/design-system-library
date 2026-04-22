import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { breadcrumbItemStyles } from './breadcrumb-item.styles.js';
import '../icon/define.js';
import '../icon/icons/chevron-right.js';

/**
 * @tag ds-breadcrumb-item
 * @summary A single crumb in a ds-breadcrumb trail. Renders as `<a>` when not current, `<span>` when current.
 * @slot default - The crumb label.
 * @slot leading - Optional icon rendered before the label (e.g. home icon on the first crumb).
 * @csspart link - The internal `<a>` element on non-current items.
 * @csspart current - The `<span>` wrapper on the current item.
 * @csspart separator - The chevron separator shown on non-last items.
 * @csspart leading - The leading slot wrapper.
 */
export class DsBreadcrumbItem extends DsElement {
  static override styles = [...DsElement.styles, breadcrumbItemStyles];

  @property() href?: string;
  @property() target?: string;
  @property() rel?: string;
  @property() download?: string;
  @property() hreflang?: string;
  @property() type?: string;
  @property() referrerpolicy?: string;
  @property({ type: Boolean, reflect: true }) current = false;
  @property({ type: Boolean, reflect: true }) last = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'listitem');
  }

  #renderLabel(): TemplateResult {
    return html`<slot name="leading" part="leading"></slot><slot></slot>`;
  }

  #renderAnchor(): TemplateResult {
    return html`
      <a
        part="link"
        href=${this.href ?? '#'}
        target=${this.target ?? nothing}
        rel=${this.rel ?? nothing}
        download=${this.download ?? nothing}
        hreflang=${this.hreflang ?? nothing}
        type=${this.type ?? nothing}
        referrerpolicy=${this.referrerpolicy ?? nothing}
      >
        ${this.#renderLabel()}
      </a>
    `;
  }

  #renderCurrent(): TemplateResult {
    return html`
      <span part="current" class="current" aria-current="page">
        ${this.#renderLabel()}
      </span>
    `;
  }

  #renderSeparator(): TemplateResult | typeof nothing {
    if (this.last) {
      return nothing;
    }
    return html`
      <span part="separator" class="separator" role="presentation" aria-hidden="true">
        <ds-icon name="chevron-right" size="sm"></ds-icon>
      </span>
    `;
  }

  override render(): TemplateResult {
    return html`
      ${this.current ? this.#renderCurrent() : this.#renderAnchor()}
      ${this.#renderSeparator()}
    `;
  }
}
