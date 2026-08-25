import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { colorForIndex } from '../../shared/chart-colors.js';
import { shareBarStyles } from './share-bar.styles.js';
import type { ShareBarDatum, ShareBarSegment } from './types.js';

function isPositive(datum: ShareBarDatum): boolean {
  return Number.isFinite(datum.value) && datum.value > 0;
}

function smallest(data: readonly ShareBarDatum[], count: number): Set<ShareBarDatum> {
  return new Set([...data].sort((a, b) => b.value - a.value).slice(count));
}

/**
 * @tag ds-share-bar
 * @summary Single stacked bar showing how a total splits across categories, with a legend.
 * @slot empty - Replaces the message shown when every value is zero.
 * @attr {string} empty-label - Default empty message. The `empty` slot overrides it.
 * @csspart share - The outer container.
 * @csspart title - The bar title.
 * @csspart bar - The stacked bar track.
 * @csspart segment - Each colored share of the bar.
 * @csspart legend - The legend list.
 * @csspart swatch - A legend color swatch.
 * @csspart empty - The empty message.
 * @cssprop --ds-share-bar-height - Bar thickness. Defaults to `--ds-space-4`.
 * @cssprop --ds-share-bar-radius - Bar corner radius. Defaults to `--ds-radius-sm`.
 * @cssprop --ds-share-bar-gap - Space between title, bar and legend. Defaults to `--ds-space-2`.
 * @cssprop --ds-share-bar-segment-min-width - Floor that keeps a tiny share visible. Defaults to `2px`.
 */
export class DsShareBar extends DsElement {
  static override styles = [...DsElement.styles, shareBarStyles];

  @property({ attribute: false }) data: readonly ShareBarDatum[] = [];
  @property() override title = '';
  @property({ type: Boolean, reflect: true, attribute: 'show-legend' }) showLegend = true;
  @property({ type: Number, attribute: 'max-segments' }) maxSegments = 8;
  @property({ attribute: 'other-label' }) otherLabel = 'Other';
  @property({ attribute: 'empty-label' }) emptyLabel = 'No data';
  @property({ attribute: false }) formatPercent?: (percent: number) => string;

  #segments(): ShareBarSegment[] {
    const shown = this.data.filter(isPositive);
    const total = shown.reduce((sum, datum) => sum + datum.value, 0);
    if (total === 0) {
      return [];
    }
    const overflow =
      this.maxSegments > 0 && shown.length > this.maxSegments
        ? smallest(shown, this.maxSegments - 1)
        : new Set<ShareBarDatum>();
    const segments = shown
      .filter((datum) => !overflow.has(datum))
      .map((datum) => ({
        label: datum.label,
        value: datum.value,
        percent: (datum.value / total) * 100,
        ...(datum.color === undefined ? {} : { color: datum.color }),
        isOther: false,
      }));
    if (overflow.size === 0) {
      return segments;
    }
    const value = [...overflow].reduce((sum, datum) => sum + datum.value, 0);
    return [...segments, { label: this.otherLabel, value, percent: (value / total) * 100, isOther: true }];
  }

  #color(segment: ShareBarSegment, index: number): string {
    if (segment.color !== undefined) {
      return segment.color;
    }
    return segment.isOther ? 'var(--ds-color-fg-muted)' : colorForIndex(index);
  }

  #percentText(percent: number): string {
    return this.formatPercent ? this.formatPercent(percent) : `${Math.round(percent)}%`;
  }

  #summary(segments: readonly ShareBarSegment[]): string {
    const parts = segments.map((segment) => `${segment.label} ${this.#percentText(segment.percent)}`);
    return this.title ? `${this.title}: ${parts.join(', ')}` : parts.join(', ');
  }

  override render(): TemplateResult {
    const segments = this.#segments();
    return html`
      <div class="share" part="share">
        <p class="title" part="title">${this.title}</p>
        <div class="bar" part="bar" role="img" aria-label=${this.#summary(segments)}>
          ${segments.map(
            (segment, index) => html`
              <span
                class="segment"
                part="segment"
                style=${styleMap({ flexGrow: String(segment.value), background: this.#color(segment, index) })}
              ></span>
            `,
          )}
        </div>
        ${segments.length === 0 ? this.#renderEmpty() : this.#renderLegend(segments)}
      </div>
    `;
  }

  #renderEmpty(): TemplateResult {
    return html`<p class="empty" part="empty"><slot name="empty">${this.emptyLabel}</slot></p>`;
  }

  #renderLegend(segments: readonly ShareBarSegment[]): TemplateResult | typeof nothing {
    if (!this.showLegend) {
      return nothing;
    }
    return html`
      <ul class="legend" part="legend">
        ${segments.map(
          (segment, index) => html`
            <li>
              <span class="swatch" part="swatch" style=${styleMap({ background: this.#color(segment, index) })}></span>
              ${segment.label}
              <span class="percent">${this.#percentText(segment.percent)}</span>
            </li>
          `,
        )}
      </ul>
    `;
  }
}
