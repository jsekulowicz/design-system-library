import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { tabPanelStyles } from './tab-panel.styles.js';

/**
 * @tag ds-tab-panel
 * @summary Content region associated with a ds-tab.
 * @slot default - Panel contents, shown only when the panel is active.
 */
export class DsTabPanel extends DsElement {
  static override styles = [...DsElement.styles, tabPanelStyles];

  @property() value = '';
  @property({ type: Boolean, reflect: true }) active = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'tabpanel');
    this.tabIndex = 0;
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('active')) {
      this.toggleAttribute('hidden', !this.active);
    }
  }

  override render(): TemplateResult {
    return html`<slot></slot>`;
  }
}
