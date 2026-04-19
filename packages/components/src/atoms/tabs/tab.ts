import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tabStyles } from './tab.styles.js';

/**
 * @tag ds-tab
 * @summary Individual tab trigger inside a ds-tabs tablist.
 * @slot default - Tab label content.
 * @csspart tab - The inner tab surface.
 */
export class DsTab extends DsElement {
  static override styles = [...DsElement.styles, tabStyles];

  @property() value = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tab');
    this.addEventListener('click', this.#onClick);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#onClick);
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('selected')) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }
    if (changed.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
  }

  #onClick = (): void => {
    if (this.disabled) {
      return;
    }
    this.emit('ds-tab-activate', { detail: { value: this.value } });
  };

  override render(): TemplateResult {
    return html`<div class="tab" part="tab"><slot></slot></div>`;
  }
}
