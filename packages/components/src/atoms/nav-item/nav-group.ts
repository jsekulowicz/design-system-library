import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { navGroupStyles } from './nav-group.styles.js';
import '../icon/define.js';
import '../icon/icons/chevron-down.js';

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
              <ds-icon name="chevron-down" size="sm"></ds-icon>
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
