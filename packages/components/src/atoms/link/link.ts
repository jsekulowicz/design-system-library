import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { linkStyles } from './link.styles.js';

export type LinkVariant = 'inline' | 'quiet' | 'standalone';

/**
 * @tag ds-link
 * @summary Accessible anchor styled by the design system.
 * @slot default - The link label.
 */
export class DsLink extends DsElement {
  static override styles = [...DsElement.styles, linkStyles];

  @property() href = '#';
  @property() target?: '_self' | '_blank' | '_parent' | '_top';
  @property() rel?: string;
  @property({ reflect: true }) variant: LinkVariant = 'inline';
  @property({ type: Boolean }) external = false;

  #resolveRel(): string | undefined {
    if (this.rel) {
      return this.rel;
    }
    if (this.external || this.target === '_blank') {
      return 'noopener noreferrer';
    }
    return undefined;
  }

  override render(): TemplateResult {
    const rel = this.#resolveRel();
    return html`<a
      part="link"
      href=${this.href}
      target=${this.target ?? nothing}
      rel=${rel ?? nothing}
    >
      <slot></slot>
    </a>`;
  }
}
