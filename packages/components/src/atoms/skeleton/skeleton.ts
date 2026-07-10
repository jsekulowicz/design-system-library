import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { skeletonStyles } from './skeleton.styles.js';

export type SkeletonVariant = 'text' | 'rectangle' | 'circle';

/**
 * @tag ds-skeleton
 * @summary Decorative placeholder for content that is still loading.
 * @slot default - Optional accessible loading text for assistive technology.
 * @csspart item - Each generated skeleton item.
 */
export class DsSkeleton extends DsElement {
  static override styles = [...DsElement.styles, skeletonStyles];

  @property({ reflect: true }) variant: SkeletonVariant = 'text';
  @property({ type: Number }) lines = 1;
  @property() width?: string;
  @property() height?: string;

  override updated(): void {
    this.#syncHostProperty('--ds-skeleton-width', this.width);
    this.#syncHostProperty('--ds-skeleton-height', this.height);
  }

  #count(): number {
    return Math.max(1, Math.floor(this.lines || 1));
  }

  #syncHostProperty(name: string, value?: string): void {
    if (value) {
      this.style.setProperty(name, value);
      return;
    }
    this.style.removeProperty(name);
  }

  #lineWidth(index: number): string | undefined {
    if (this.width) {
      return this.width;
    }
    if (this.variant !== 'text' || this.#count() === 1) {
      return undefined;
    }
    return index === this.#count() - 1 ? '72%' : undefined;
  }

  #style(index: number): string {
    const styles: string[] = [];
    const width = this.#lineWidth(index);
    if (width) {
      styles.push(`--ds-skeleton-item-width: ${width}`);
    }
    return styles.join('; ');
  }

  override render(): TemplateResult {
    return html`
      <div class="stack" aria-hidden="true">
        ${Array.from({ length: this.#count() }, (_, index) => html`
          <div class="item" part="item" style=${this.#style(index)}></div>
        `)}
      </div>
      <slot class="visually-hidden"></slot>
    `;
  }
}
