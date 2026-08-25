import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { dividerStyles } from './divider.styles.js';

export type DividerOrientation = 'horizontal' | 'vertical';

/**
 * @tag ds-divider
 * @summary A thin separator line. Horizontal by default, can be vertical.
 * @attr {string} orientation - 'horizontal' (default) or 'vertical'.
 */
export class DsDivider extends DsElement {
  static override styles = [...DsElement.styles, dividerStyles];

  @property({ reflect: true }) orientation: DividerOrientation = 'horizontal';

  override render(): TemplateResult {
    const ariaOrientation = this.orientation === 'vertical' ? 'vertical' : 'horizontal';
    return html`<span role="separator" aria-orientation=${ariaOrientation} part="line"></span>`;
  }
}
