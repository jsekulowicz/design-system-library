import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import type { LinkTarget } from '@jsekulowicz/ds-core';
import { breadcrumbItemStyles } from './breadcrumb-item.styles.js';
import '../icon/define.js';
import '../icon/icons/chevron-right.js';

/**
 * @tag ds-breadcrumb-item
 * @summary A single crumb in a ds-breadcrumb trail. Renders as `<a>` when it has an href, `<span>` otherwise.
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
  @property() target?: LinkTarget;
  @property() rel?: string;
  @property() download?: string;
  @property() hreflang?: string;
  @property() type?: string;
  @property() referrerpolicy?: ReferrerPolicy;
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
        target=${ifDefined(this.target)}
        rel=${ifDefined(this.rel)}
        download=${ifDefined(this.download)}
        hreflang=${ifDefined(this.hreflang)}
        type=${ifDefined(this.type)}
        referrerpolicy=${ifDefined(this.referrerpolicy)}
      >
        ${this.#renderLabel()}
      </a>
    `;
  }

  #renderText(): TemplateResult {
    const ariaCurrent = this.current ? 'page' : undefined;
    return html`
      <span part="current" class="current" aria-current=${ifDefined(ariaCurrent)}> ${this.#renderLabel()} </span>
    `;
  }

  #renderSeparator(): TemplateResult | typeof nothing {
    if (this.last) {
      return nothing;
    }
    return html`
      <span part="separator" class="separator" role="presentation" aria-hidden="true">
        <ds-icon name="chevron-right" size="md"></ds-icon>
      </span>
    `;
  }

  override render(): TemplateResult {
    return html` ${this.href ? this.#renderAnchor() : this.#renderText()} ${this.#renderSeparator()} `;
  }
}
