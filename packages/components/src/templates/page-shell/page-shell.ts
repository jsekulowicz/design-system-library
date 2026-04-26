import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { pageShellStyles } from './page-shell.styles.js';

/**
 * @tag ds-page-shell
 * @summary Application frame: header + aside + main + footer with responsive collapse.
 * @slot brand - Top-left brand/logo.
 * @slot header-actions - Top-right actions.
 * @slot aside - Side navigation.
 * @slot default - Main content.
 * @slot footer - Footer content.
 */
export class DsPageShell extends DsElement {
  static override styles = [...DsElement.styles, pageShellStyles];

  @property() brand = '';

  #asideObserver: MutationObserver | null = null;

  #syncCollapsed(el: Element | null) {
    this.toggleAttribute('aside-collapsed', !!el?.hasAttribute('collapsed'));
  }

  #onAsideSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement;
    const aside = slot.assignedElements()[0] ?? null;

    this.#asideObserver?.disconnect();
    this.#syncCollapsed(aside);

    if (aside) {
      this.#asideObserver = new MutationObserver(() => this.#syncCollapsed(aside));
      this.#asideObserver.observe(aside, { attributes: true, attributeFilter: ['collapsed'] });
    }
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    this.#asideObserver?.disconnect();
  }

  override render(): TemplateResult {
    return html`<header part="header">
        <div class="brand">
          <slot name="brand">${this.brand}</slot>
        </div>
        <div><slot name="header-actions"></slot></div>
      </header>
      <aside part="aside">
        <slot name="aside" @slotchange=${this.#onAsideSlotChange}></slot>
      </aside>
      <main part="main">
        <slot></slot>
      </main>
      <footer part="footer">
        <slot name="footer"></slot>
      </footer>`;
  }
}
