import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state, query } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../../atoms/skeleton/define.js';
import { barChartStyles } from './bar-chart.styles.js';
import { colorForIndex } from '../../shared/chart-colors.js';
import { focusDatum, renderChartLiveRegion, renderChartTitle } from '../../shared/chart-a11y.js';
import { computeChartLayout, type ChartLayout } from './chart-layout.js';
import { renderChartSvg } from './bar-chart-svg.js';
import { renderTooltip, renderLegend, renderSrTable, rootAriaLabel, liveText } from './bar-chart-overlays.js';
import type { BarChartRow, BarChartSeries, ChartRenderContext } from './types.js';

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
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ attribute: false }) formatValue?: (v: number) => string;
  @property({ attribute: false }) formatDomain?: (v: unknown) => string;
  @property({ attribute: false }) formatTooltipTitle?: (v: unknown) => string;

  @state() private _width = 0;
  @state() private _activeIndex: number | null = null;
  @state() private _focusMode: 'keyboard' | 'pointer' | null = null;

  @query('.frame') private _frame!: HTMLElement;
  #resizeObserver?: ResizeObserver;

  override firstUpdated(): void {
    this.#observeResize();
    this.#remeasureNextFrame();
  }

  override updated(changedProperties: PropertyValues<this>): void {
    if (changedProperties.has('loading') && !this.loading) {
      this.#observeResize();
      this.#remeasureNextFrame();
    }
  }

  #remeasureNextFrame(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      return;
    }
    requestAnimationFrame(() => {
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
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = new ResizeObserver(entries => {
      const entry = entries[0];
      if (entry) {
        this._width = Math.max(0, entry.contentRect.width);
      }
    });
    this.#resizeObserver.observe(this._frame);
  }

  #renderContext(): ChartRenderContext {
    return {
      uid: this.uid,
      title: this.title,
      domainKey: String(this.domain),
      stacked: this.stacked,
      series: this.series,
      activeIndex: this._activeIndex,
      focusMode: this._focusMode,
      xAxisLabel: this.xAxisLabel,
      yAxisLabel: this.yAxisLabel,
      seriesLabel: (s) => s.label ?? s.key,
      seriesColor: (s, i) => s.color ?? colorForIndex(i),
      formatValue: (v) => (this.formatValue ? this.formatValue(v) : String(v)),
      formatDomain: (v) => (this.formatDomain ? this.formatDomain(v) : String(v ?? '')),
      formatTooltipTitle: (v) => {
        if (this.formatTooltipTitle) {
          return this.formatTooltipTitle(v);
        }
        return this.formatDomain ? this.formatDomain(v) : String(v ?? '');
      },
    };
  }

  #computeLayout(): ChartLayout<T> {
    return computeChartLayout({
      data: this.data,
      domain: this.domain,
      seriesKeys: this.series.map(s => s.key),
      stacked: this.stacked,
      measuredWidth: this._width,
      height: this.height,
      hasXAxisLabel: Boolean(this.xAxisLabel),
      hasYAxisLabel: Boolean(this.yAxisLabel),
    });
  }

  override render(): TemplateResult {
    const ctx = this.#renderContext();
    if (this.loading) {
      return html`
        <div
          class="frame loading-frame"
          style="height:${this.height}px"
          aria-busy="true"
          aria-label=${this.title || 'Bar chart'}
        >
          <ds-skeleton variant="rectangle" width="100%" height="100%"></ds-skeleton>
        </div>
        ${this.showLegend ? renderLegend(ctx) : nothing}
      `;
    }
    const layout = this.#computeLayout();
    if (layout.groups.length === 0) {
      return html`<div class="frame" style="height:${this.height}px"></div>`;
    }
    return html`
      <div
        class="frame"
        style="height:${this.height}px"
        @keydown=${this.#onKeydown}
        @focusin=${this.#onFocusIn}
        @focusout=${this.#onFocusOut}
        @pointermove=${this.#onPointerMove}
        @pointerleave=${this.#onPointerLeave}
        part="chart"
      >
        ${renderChartSvg(ctx, layout, this.height)}
        ${renderTooltip(ctx, layout)}
      </div>
      ${this.showLegend ? renderLegend(ctx) : nothing}
      ${renderChartTitle(this.uid, rootAriaLabel(ctx, layout.groups.length))}
      ${renderSrTable(ctx, layout.groups)}
      ${renderChartLiveRegion(liveText(ctx, layout.groups))}
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
        values: this.series.map((s) => ({
          key: s.key,
          label: s.label ?? s.key,
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
    let next: number;
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
    void this.updateComplete.then(() => focusDatum(this.shadowRoot, this.uid, 'group', next));
  };

  #onFocusIn = (event: FocusEvent): void => {
    const index = groupIndexFrom(event.target);
    if (index == null) {
      return;
    }
    this._focusMode = 'keyboard';
    this.#setActive(index);
  };

  #onFocusOut = (event: FocusEvent): void => {
    if (this.shadowRoot?.contains(event.relatedTarget as Node)) {
      return;
    }
    this._focusMode = null;
    this.#setActive(null);
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
    const index = Math.min(layout.bands.length - 1, Math.max(0, Math.floor(localX / Math.max(1, layout.bands[0]!.bandWidth))));
    this._focusMode = 'pointer';
    this.#setActive(index);
  };

  #onPointerLeave = (): void => {
    if (this._focusMode === 'pointer') {
      this._focusMode = null;
    }
    this.#setActive(null);
  };

}

function groupIndexFrom(target: EventTarget | null): number | null {
  const group = target instanceof Element ? target.closest('.bar-group') : null;
  const index = group?.getAttribute('data-index');
  return index == null ? null : Number(index);
}
