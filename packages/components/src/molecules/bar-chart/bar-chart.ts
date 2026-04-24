import { html, svg, type TemplateResult, type SVGTemplateResult, nothing } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { barChartStyles } from './bar-chart.styles.js';
import { colorForIndex } from './colors.js';
import {
  niceMax,
  generateTicks,
  groupData,
  computeGroupBands,
  computeGroupedBars,
  computeStackSegments,
  type GroupBand,
} from './layout.js';
import type { BarChartGroup, BarChartRow, BarChartSeries } from './types.js';

const MARGIN = { top: 16, right: 16, bottomBase: 36, leftBase: 44 } as const;
const BAND_OUTER_GAP = 0.18;
const BAR_INNER_GAP = 2;
const MIN_SEGMENT_HEIGHT = 1;
const FALLBACK_WIDTH = 640;

/**
 * @tag ds-bar-chart
 * @summary Responsive grouped or stacked bar chart with keyboard navigation and hover tooltips.
 * @event ds-bar-focus - Emitted when the active group changes by keyboard or pointer. Detail: `{ groupIndex, domainValue, values }`.
 * @csspart chart - The internal `<svg>` element.
 * @csspart tooltip - The floating tooltip container.
 * @csspart legend - The legend wrapper.
 */
export class DsBarChart<T extends BarChartRow = BarChartRow> extends DsElement {
  static override styles = [...DsElement.styles, barChartStyles];

  @property({ attribute: false }) data: readonly T[] = [];
  @property() domain: keyof T & string = '' as keyof T & string;
  @property({ attribute: false }) series: readonly BarChartSeries[] = [];
  @property({ type: Boolean, reflect: true }) stacked = false;
  @property({ attribute: 'x-axis-label' }) xAxisLabel?: string;
  @property({ attribute: 'y-axis-label' }) yAxisLabel?: string;
  @property() override title = '';
  @property({ type: Number }) height = 320;
  @property({ type: Boolean, reflect: true, attribute: 'show-legend' }) showLegend = true;
  @property({ attribute: false }) formatValue?: (v: number) => string;
  @property({ attribute: false }) formatDomain?: (v: unknown) => string;

  @state() private _width = 0;
  @state() private _activeIndex: number | null = null;
  @state() private _focusMode: 'keyboard' | 'pointer' | null = null;

  @query('.frame') private _frame!: HTMLElement;
  #resizeObserver?: ResizeObserver;

  override firstUpdated(): void {
    this.#observeResize();
    this.#remeasureNextFrame();
  }

  #remeasureNextFrame(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      return;
    }
    requestAnimationFrame(() => {
      if (!this._frame) {
        return;
      }
      const measured = this._frame.clientWidth;
      if (measured > 0 && measured !== this._width) {
        this._width = measured;
      }
    });
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
  }

  #observeResize(): void {
    if (!this._frame || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.#resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        this._width = Math.max(0, entry.contentRect.width);
      }
    });
    this.#resizeObserver.observe(this._frame);
    const measured = this._frame.clientWidth;
    if (measured > 0) {
      this._width = measured;
    }
  }

  #seriesLabel(s: BarChartSeries): string {
    return s.label ?? s.key;
  }

  #seriesColor(s: BarChartSeries, i: number): string {
    return s.color ?? colorForIndex(i);
  }

  #formatValue(v: number): string {
    return this.formatValue ? this.formatValue(v) : String(v);
  }

  #formatDomain(v: unknown): string {
    return this.formatDomain ? this.formatDomain(v) : String(v ?? '');
  }

  #computeLayout() {
    const groups = groupData(this.data, this.domain, this.series.map(s => s.key));
    const maxValue = groups.reduce((acc, g) => {
      const v = this.stacked ? g.total : Math.max(...Object.values(g.values), 0);
      return Math.max(acc, v);
    }, 0);
    const yMax = niceMax(maxValue);
    const ticks = generateTicks(yMax);
    const margin = {
      top: MARGIN.top,
      right: MARGIN.right,
      bottom: MARGIN.bottomBase + (this.xAxisLabel ? 18 : 0),
      left: MARGIN.leftBase + (this.yAxisLabel ? 18 : 0),
    };
    const width = this._width > 0 ? this._width : FALLBACK_WIDTH;
    const innerWidth = Math.max(0, width - margin.left - margin.right);
    const innerHeight = Math.max(0, this.height - margin.top - margin.bottom);
    const bands = computeGroupBands(innerWidth, groups.length, BAND_OUTER_GAP);
    return { groups, yMax, ticks, margin, width, innerWidth, innerHeight, bands };
  }

  #xTickEvery(bandWidth: number): number {
    if (bandWidth >= 24) return 1;
    if (bandWidth >= 12) return 2;
    if (bandWidth >= 6) return 4;
    return Math.max(1, Math.ceil(32 / Math.max(1, bandWidth)));
  }

  #xLabelRotation(bandWidth: number): number {
    return bandWidth < 48 ? -35 : 0;
  }

  override render(): TemplateResult {
    const layout = this.#computeLayout();
    const { groups, yMax, innerHeight, width, margin, bands, ticks } = layout;
    if (groups.length === 0) {
      return html`<div class="frame" style="height:${this.height}px" tabindex="0"></div>`;
    }
    return html`
      <div
        class="frame"
        style="height:${this.height}px"
        tabindex="0"
        role="application"
        aria-label=${this.#rootAriaLabel(groups.length)}
        aria-describedby="${this.uid}-desc"
        aria-activedescendant=${this._activeIndex == null ? nothing : `${this.uid}-group-${this._activeIndex}`}
        @keydown=${this.#onKeydown}
        @pointermove=${this.#onPointerMove}
        @pointerleave=${this.#onPointerLeave}
        @blur=${this.#onBlur}
        part="chart"
      >
        <svg role="img" aria-hidden="true" viewBox="0 0 ${width} ${this.height}" width=${width} height=${this.height} preserveAspectRatio="none">
          <g transform="translate(${margin.left}, ${margin.top})">
            ${this.#renderGrid(ticks, innerHeight, layout.innerWidth)}
            ${this.#renderYAxis(ticks, innerHeight, margin.left)}
            ${this.#renderXAxis(groups, bands, innerHeight, margin)}
            ${this.#renderBars(groups, bands, innerHeight, yMax)}
            ${this.#renderFocusRing(bands, innerHeight, groups, yMax)}
          </g>
        </svg>
        ${this.#renderTooltip(layout)}
        ${this.#renderSrTable(groups)}
        <div class="sr-only" id="${this.uid}-live" role="status" aria-live="polite">${this.#liveText(groups)}</div>
      </div>
      ${this.showLegend ? this.#renderLegend() : nothing}
    `;
  }

  #rootAriaLabel(groupCount: number): string {
    const base = this.title || 'Bar chart';
    const seriesLabels = this.series.map(s => this.#seriesLabel(s)).join(', ');
    return `${base}: ${groupCount} ${this.stacked ? 'stacked ' : ''}groups, series: ${seriesLabels}. Use left and right arrow keys to move between groups.`;
  }

  #liveText(groups: BarChartGroup<T>[]): string {
    if (this._activeIndex == null) {
      return '';
    }
    const g = groups[this._activeIndex];
    if (!g) {
      return '';
    }
    const domain = this.#formatDomain(g.domain);
    const parts = this.series.map(s => `${this.#seriesLabel(s)} ${this.#formatValue(g.values[s.key] ?? 0)}`);
    const total = this.stacked ? `. Total ${this.#formatValue(g.total)}` : '';
    return `${domain}: ${parts.join(', ')}${total}.`;
  }

  #renderGrid(ticks: number[], innerHeight: number, innerWidth: number): SVGTemplateResult {
    return svg`
      <g class="grid" aria-hidden="true">
        ${ticks.map(tick => {
          const y = innerHeight - (tick / (ticks.at(-1) || 1)) * innerHeight;
          return svg`<line x1="0" x2=${innerWidth} y1=${y} y2=${y}></line>`;
        })}
      </g>
    `;
  }

  #renderYAxis(ticks: number[], innerHeight: number, marginLeft: number): SVGTemplateResult {
    const yMax = ticks.at(-1) || 1;
    return svg`
      <g class="axis axis-y" aria-hidden="true">
        <line x1="0" x2="0" y1="0" y2=${innerHeight}></line>
        ${ticks.map(tick => {
          const y = innerHeight - (tick / yMax) * innerHeight;
          return svg`
            <g transform="translate(0, ${y})">
              <line x1="-4" x2="0" y1="0" y2="0"></line>
              <text x="-8" y="0" text-anchor="end" dominant-baseline="middle">${this.#formatValue(tick)}</text>
            </g>
          `;
        })}
        ${this.yAxisLabel
          ? svg`<text class="axis-label" transform="translate(${-marginLeft + 12}, ${innerHeight / 2}) rotate(-90)" text-anchor="middle">${this.yAxisLabel}</text>`
          : nothing}
      </g>
    `;
  }

  #renderXAxis(groups: BarChartGroup<T>[], bands: GroupBand[], innerHeight: number, margin: { bottom: number }): SVGTemplateResult {
    const bandWidth = bands[0]?.bandWidth ?? 0;
    const every = this.#xTickEvery(bandWidth);
    const rotation = this.#xLabelRotation(bandWidth);
    return svg`
      <g class="axis axis-x" aria-hidden="true" transform="translate(0, ${innerHeight})">
        <line x1="0" x2=${bands.at(-1)?.x ? bands.at(-1)!.x + bands.at(-1)!.bandWidth : 0} y1="0" y2="0"></line>
        ${groups.map((g, i) => {
          if (i % every !== 0) {
            return nothing;
          }
          const band = bands[i];
          if (!band) {
            return nothing;
          }
          const cx = band.x + band.bandWidth / 2;
          const text = this.#formatDomain(g.domain);
          return svg`
            <g transform="translate(${cx}, 0)">
              <line x1="0" x2="0" y1="0" y2="4"></line>
              <text y="18" text-anchor=${rotation ? 'end' : 'middle'} transform=${rotation ? `rotate(${rotation}) translate(-4, -6)` : ''}>${text}</text>
            </g>
          `;
        })}
        ${this.xAxisLabel
          ? svg`<text class="axis-label" x=${(bands.at(-1)?.x ?? 0) / 2 + (bands[0]?.bandWidth ?? 0) / 2} y=${margin.bottom - 8} text-anchor="middle">${this.xAxisLabel}</text>`
          : nothing}
      </g>
    `;
  }

  #renderBars(groups: BarChartGroup<T>[], bands: GroupBand[], innerHeight: number, yMax: number): SVGTemplateResult {
    return svg`${groups.map((g, gi) => {
      const band = bands[gi];
      if (!band) {
        return nothing;
      }
      const inactive = this._activeIndex != null && this._activeIndex !== gi ? 'inactive' : '';
      const content = this.stacked
        ? this.#renderStackedBars(g, band, innerHeight, yMax)
        : this.#renderGroupedBars(g, band, innerHeight, yMax);
      return svg`<g class="bar-group ${inactive}" id="${this.uid}-group-${gi}" data-index=${gi}>${content}</g>`;
    })}`;
  }

  #renderStackedBars(g: BarChartGroup<T>, band: GroupBand, innerHeight: number, yMax: number): SVGTemplateResult {
    const segments = computeStackSegments(g.values, this.series.map(s => s.key), innerHeight, yMax);
    return svg`${segments.map((seg, si) => {
      const s = this.series[si];
      if (!s) {
        return nothing;
      }
      const height = seg.value > 0 ? Math.max(MIN_SEGMENT_HEIGHT, seg.height) : 0;
      const y = innerHeight - (segments.slice(0, si + 1).reduce((a, v) => a + Math.max(v.value > 0 ? MIN_SEGMENT_HEIGHT : 0, v.height), 0));
      return svg`<rect class="bar" x=${band.innerX} y=${y} width=${band.innerWidth} height=${height} fill=${this.#seriesColor(s, si)}></rect>`;
    })}`;
  }

  #renderGroupedBars(g: BarChartGroup<T>, band: GroupBand, innerHeight: number, yMax: number): SVGTemplateResult {
    const bars = computeGroupedBars(band.innerX, band.innerWidth, this.series.length, BAR_INNER_GAP);
    return svg`${this.series.map((s, si) => {
      const bar = bars[si];
      if (!bar) {
        return nothing;
      }
      const value = g.values[s.key] ?? 0;
      const h = yMax > 0 ? (value / yMax) * innerHeight : 0;
      const drawH = value > 0 ? Math.max(MIN_SEGMENT_HEIGHT, h) : 0;
      const y = innerHeight - drawH;
      return svg`<rect class="bar" x=${bar.x} y=${y} width=${bar.width} height=${drawH} fill=${this.#seriesColor(s, si)}></rect>`;
    })}`;
  }

  #activeGroupMaxHeight(groups: BarChartGroup<T>[], innerHeight: number, yMax: number): number {
    if (this._activeIndex == null || yMax <= 0) {
      return 0;
    }
    const g = groups[this._activeIndex];
    if (!g) {
      return 0;
    }
    const value = this.stacked ? g.total : Math.max(...Object.values(g.values), 0);
    return (value / yMax) * innerHeight;
  }

  #renderFocusRing(bands: GroupBand[], innerHeight: number, groups: BarChartGroup<T>[], yMax: number): SVGTemplateResult | typeof nothing {
    if (this._activeIndex == null || this._focusMode !== 'keyboard') {
      return nothing;
    }
    const band = bands[this._activeIndex];
    if (!band) {
      return nothing;
    }
    const maxHeight = this.#activeGroupMaxHeight(groups, innerHeight, yMax);
    const drawHeight = Math.max(4, maxHeight);
    const y = innerHeight - drawHeight - 2;
    return svg`<rect class="focus-ring" x=${band.innerX - 2} y=${y} width=${band.innerWidth + 4} height=${drawHeight + 4} rx="4"></rect>`;
  }

  #renderTooltip(layout: ReturnType<typeof this.computeLayoutSnapshot>): TemplateResult {
    const { bands, groups, margin, innerHeight, yMax } = layout;
    const hidden = this._activeIndex == null;
    const group = this._activeIndex != null ? groups[this._activeIndex] : undefined;
    const band = this._activeIndex != null ? bands[this._activeIndex] : undefined;
    const x = band ? margin.left + band.innerX + band.innerWidth / 2 : 0;
    const maxHeight = this.#activeGroupMaxHeight(groups, innerHeight, yMax);
    const barTopY = margin.top + (innerHeight - maxHeight);
    const placeBelow = barTopY < 96;
    const y = barTopY;
    return html`
      <div
        class="tooltip"
        part="tooltip"
        role="tooltip"
        data-position=${placeBelow ? 'below' : 'above'}
        ?hidden=${hidden}
        style="left:${x}px; top:${y}px"
      >
        ${group ? html`
          <div class="tooltip-title">${this.#formatDomain(group.domain)}</div>
          <ul class="tooltip-rows">
            ${this.series.map((s, si) => html`
              <li class="tooltip-row-label">
                <span class="tooltip-swatch" style="background:${this.#seriesColor(s, si)}"></span>
                ${this.#seriesLabel(s)}
              </li>
              <li class="tooltip-row-value">${this.#formatValue(group.values[s.key] ?? 0)}</li>
            `)}
            ${this.stacked ? html`
              <li class="tooltip-row-label">Total</li>
              <li class="tooltip-row-value">${this.#formatValue(group.total)}</li>
            ` : nothing}
          </ul>
        ` : nothing}
      </div>
    `;
  }

  private computeLayoutSnapshot() {
    return this.#computeLayout();
  }

  #renderLegend(): TemplateResult {
    return html`
      <div class="legend" part="legend">
        ${this.series.map((s, i) => html`
          <span class="legend-item">
            <span class="legend-swatch" style="background:${this.#seriesColor(s, i)}"></span>
            ${this.#seriesLabel(s)}
          </span>
        `)}
      </div>
    `;
  }

  #renderSrTable(groups: BarChartGroup<T>[]): TemplateResult {
    return html`
      <div class="sr-only" id="${this.uid}-desc">
        <table>
          <caption>${this.title || 'Bar chart data'}</caption>
          <thead>
            <tr>
              <th scope="col">${this.xAxisLabel ?? String(this.domain)}</th>
              ${this.series.map(s => html`<th scope="col">${this.#seriesLabel(s)}</th>`)}
              ${this.stacked ? html`<th scope="col">Total</th>` : nothing}
            </tr>
          </thead>
          <tbody>
            ${groups.map(g => html`
              <tr>
                <th scope="row">${this.#formatDomain(g.domain)}</th>
                ${this.series.map(s => html`<td>${this.#formatValue(g.values[s.key] ?? 0)}</td>`)}
                ${this.stacked ? html`<td>${this.#formatValue(g.total)}</td>` : nothing}
              </tr>
            `)}
          </tbody>
        </table>
      </div>
    `;
  }

  #setActive(index: number | null): void {
    if (this._activeIndex === index) {
      return;
    }
    this._activeIndex = index;
    if (index == null) {
      return;
    }
    const g = this.#computeLayout().groups[index];
    if (!g) {
      return;
    }
    this.emit('ds-bar-focus', {
      detail: {
        groupIndex: index,
        domainValue: g.domain,
        values: this.series.map(s => ({
          key: s.key,
          label: this.#seriesLabel(s),
          value: g.values[s.key] ?? 0,
        })),
      },
    });
  }

  #onKeydown = (event: KeyboardEvent): void => {
    const count = this.data.length;
    if (count === 0) {
      return;
    }
    const current = this._activeIndex ?? -1;
    let next = current;
    switch (event.key) {
      case 'ArrowRight': next = Math.min(count - 1, current + 1); break;
      case 'ArrowLeft': next = Math.max(0, current < 0 ? 0 : current - 1); break;
      case 'Home': next = 0; break;
      case 'End': next = count - 1; break;
      case 'Escape': this._focusMode = null; this.#setActive(null); return;
      default: return;
    }
    event.preventDefault();
    this._focusMode = 'keyboard';
    this.#setActive(next);
  };

  #onPointerMove = (event: PointerEvent): void => {
    const layout = this.#computeLayout();
    if (!layout.bands.length) {
      return;
    }
    const rect = this._frame.getBoundingClientRect();
    const localX = event.clientX - rect.left - layout.margin.left;
    if (localX < 0 || localX > layout.innerWidth) {
      this.#setActive(null);
      return;
    }
    const index = Math.min(layout.bands.length - 1, Math.max(0, Math.floor(localX / (layout.bands[0]?.bandWidth || 1))));
    this._focusMode = 'pointer';
    this.#setActive(index);
  };

  #onPointerLeave = (): void => {
    if (this._focusMode === 'pointer') {
      this._focusMode = null;
    }
    this.#setActive(null);
  };

  #onBlur = (): void => {
    this._focusMode = null;
    this.#setActive(null);
  };
}
