import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { listStyles } from './list.styles.js';

export type ListVariant = 'plain' | 'bordered';
export type ListDensity = 'compact' | 'default';

/**
 * @tag ds-list
 * @summary Vertical stack of `ds-list-item` rows, optionally bordered with hairline dividers.
 * @slot default - One or more `ds-list-item` children.
 * @attr {string} variant - `plain` (no surrounding border) or `bordered` (default).
 * @attr {string} density - `default` or `compact`.
 */
export class DsList extends DsElement {
  static override styles = [...DsElement.styles, listStyles];

  @property({ reflect: true }) variant: ListVariant = 'bordered';
  @property({ reflect: true }) density: ListDensity = 'default';

  override render(): TemplateResult {
    return html`<ul role="list" part="list"><slot></slot></ul>`;
  }
}
