import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navGroupStyles } from './nav-group.styles.js';

/**
 * @tag ds-nav-group
 * @summary Collapsible heading + nested ds-nav-item children. Uses the disclosure pattern.
 * @slot default - ds-nav-item children.
 * @slot icon - Optional leading icon for the heading.
 * @event ds-group-toggle - Fires when the user toggles the heading. Detail: `{ expanded: boolean }`.
 * @csspart heading - The internal `<button>` heading.
 * @csspart chevron - The chevron icon wrapper.
 * @csspart items - The nested items container.
 */
export class DsNavGroup extends DsElement {
  static override styles = [...DsElement.styles, navGroupStyles];

  @property() label = '';
  @property({ type: Boolean, reflect: true }) expanded = false;
  @property({ type: Boolean }) collapsible = true;

  #onHeadingClick = (): void => {
    if (!this.collapsible) {
      return;
    }
    this.expanded = !this.expanded;
    this.emit('ds-group-toggle', { detail: { expanded: this.expanded } });
  };

  override render(): TemplateResult {
    const headingId = `${this.uid}-heading`;
    const itemsId = `${this.uid}-items`;
    const isOpen = !this.collapsible || this.expanded;
    return html`<button
        class="heading"
        part="heading"
        id=${headingId}
        type="button"
        aria-expanded=${this.collapsible ? String(isOpen) : 'true'}
        aria-controls=${itemsId}
        ?disabled=${!this.collapsible}
        @click=${this.#onHeadingClick}
      >
        <span class="icon"><slot name="icon"></slot></span>
        <span class="label">${this.label}</span>
        ${this.collapsible
          ? html`<span class="chevron" part="chevron" aria-hidden="true">
              <!-- Heroicons 2.2.0 — 16/solid: chevron-down -->
              <svg viewBox="0 0 16 16" fill="currentColor">
                <path fill-rule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
              </svg>
            </span>`
          : null}
      </button>
      <div
        class="items"
        part="items"
        id=${itemsId}
        role="list"
        aria-labelledby=${headingId}
        ?hidden=${!isOpen}
      >
        <slot></slot>
      </div>`;
  }
}
