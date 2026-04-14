import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { badgeStyles } from './badge.styles.js';

export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger';

/**
 * @tag ds-badge
 * @summary Compact status indicator or tag.
 * @slot default - The badge label.
 */
export class DsBadge extends DsElement {
  static override styles = [...DsElement.styles, badgeStyles];

  @property({ reflect: true }) tone: BadgeTone = 'neutral';

  override render(): TemplateResult {
    return html`<span class="badge" part="badge"><slot></slot></span>`;
  }
}
