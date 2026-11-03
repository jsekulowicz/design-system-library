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
 * @attr {string} segment-spacing - CSS length left between segments, so neighbors read apart without telling their colors apart.
 * @csspart share - The outer container.
 * @csspart title - The bar title.
 * @csspart bar - The stacked bar track.
 * @csspart segment - Each colored share of the bar.
 * @csspart segment-icon - The square tile, in its share's color, that carries the icon of a share whose datum names one. It is centered on the share and may stand taller than the bar.
 * @csspart legend - The legend list.
 * @csspart swatch - A legend color swatch.
 * @csspart empty - The empty message.
 * @cssprop --ds-share-bar-height - Bar thickness. Defaults to `--ds-space-4`.
 * @cssprop --ds-share-bar-radius - Bar corner radius. Defaults to `--ds-radius-xs`.
 * @cssprop --ds-share-bar-gap - Space between title, bar and legend. Defaults to `--ds-space-2`.
 * @cssprop --ds-share-bar-segment-min-width - Floor that keeps a tiny share visible. Defaults to `2px`.
 * @cssprop --ds-share-bar-icon-size - Size of a segment icon. Defaults to `--ds-space-4`.
 * @cssprop --ds-share-bar-icon-tile-size - Side of the square tile behind a segment icon. Defaults to the icon size plus `--ds-space-1` on each side.
 * @cssprop --ds-share-bar-icon-radius - Corner radius of the icon tile. Defaults to `--ds-radius-xs`.
 * @cssprop --ds-share-bar-icon-color - Color of a segment icon. Defaults to `--ds-color-bg`, so it reads as cut out of the tile.
 */
export class DsShareBar extends DsElement {
  static override styles = [...DsElement.styles, shareBarStyles];

  @property({ attribute: false }) data: readonly ShareBarDatum[] = [];
  @property() override title = '';
  @property({ type: Boolean, reflect: true, attribute: 'show-legend' }) showLegend = true;
  @property({ type: Number, attribute: 'max-segments' }) maxSegments = 8;
  @property({ attribute: 'other-label' }) otherLabel = 'Other';
  @property({ attribute: 'empty-label' }) emptyLabel = 'No data';
  @property({ attribute: 'segment-spacing' }) segmentSpacing = '';
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
        ...(datum.icon === undefined ? {} : { icon: datum.icon }),
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
    const withIcons = segments.some((segment) => segment.icon !== undefined);
    return html`
      <div class="share" part="share">
        <p class="title" part="title">${this.title}</p>
        <div class=${withIcons ? 'track track--with-icons' : 'track'}>
          <div
            class="bar"
            part="bar"
            role="img"
            aria-label=${this.#summary(segments)}
            style=${styleMap({ gap: this.segmentSpacing || null })}
          >
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
          ${withIcons ? this.#renderIcons(segments) : nothing}
        </div>
        ${segments.length === 0 ? this.#renderEmpty() : this.#renderLegend(segments)}
      </div>
    `;
  }

  #renderIcons(segments: readonly ShareBarSegment[]): TemplateResult {
    return html`
      <div class="icons" aria-hidden="true" style=${styleMap({ gap: this.segmentSpacing || null })}>
        ${segments.map(
          (segment, index) => html`
            <span class="icon-slot" style=${styleMap({ flexGrow: String(segment.value) })}>
              ${
                segment.icon
                  ? html`<span
                      class="segment-icon"
                      part="segment-icon"
                      style=${styleMap({ background: this.#color(segment, index) })}
                    >
                      <ds-icon name=${segment.icon}></ds-icon>
                    </span>`
                  : nothing
              }
            </span>
          `,
        )}
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
