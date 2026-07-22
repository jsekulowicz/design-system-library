import { html, nothing, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import '../../atoms/skeleton/define.js';
import { colorForIndex } from '../../shared/chart-colors.js';
import { focusDatum, renderChartLiveRegion, renderChartTitle } from '../../shared/chart-a11y.js';
import { resolveRovingTarget } from '../../shared/roving-focus.js';
import { isKeyboardFocus, sliceIndexFrom } from './pie-focus.js';
import { pieChartStyles } from './pie-chart.styles.js';
import { preparePieSlices, sliceTotal } from './pie-layout.js';
import { renderPieSvg } from './pie-chart-svg.js';
import {
  pieLiveText,
  pieSummaryText,
  renderDonutCenter,
  renderPieLegend,
  renderPieSrTable,
  renderPieTooltip,
} from './pie-chart-overlays.js';
import type { PieChartDatum, PieRenderContext, PieSlice } from './types.js';

/**
 * @tag ds-pie-chart
 * @summary Pie or donut chart with focusable slices, tooltips, and a screen-reader data table.
 * @event ds-slice-focus - Emitted when the active slice changes. Detail: `{ index, label, value, percent, isOther }`.
 * @event ds-slice-select - Emitted on click or Enter/Space. Detail: `{ index, label, value, percent, isOther }`.
 * @slot center - Replaces the default total shown inside a donut.
 * @csspart chart - The chart frame, including the legend.
 * @csspart slice - Each focusable slice group.
 * @csspart tooltip - The floating tooltip container.
 * @csspart legend - The legend wrapper.
 * @csspart center - The donut centre container.
 */
export class DsPieChart extends DsElement {
  static override styles = [...DsElement.styles, pieChartStyles];

  @property({ attribute: false }) data: readonly PieChartDatum[] = [];
  @property() override title = '';
  @property({ type: Boolean, reflect: true }) donut = false;
  @property({ type: Number, attribute: 'inner-radius' }) innerRadius = 0.6;
  @property({ type: Number }) size = 320;
  @property({ type: Boolean, reflect: true, attribute: 'show-legend' }) showLegend = true;
  @property({ type: Boolean, reflect: true, attribute: 'show-percentages' }) showPercentages = true;
  @property({ type: Number, attribute: 'max-slices' }) maxSlices = 0;
  @property({ type: Number, attribute: 'other-threshold' }) otherThreshold = 0;
  @property({ attribute: 'other-label' }) otherLabel = 'Other';
  @property({ type: Boolean, attribute: 'include-zero-slices' }) includeZeroSlices = false;
  @property({ type: Number, attribute: 'min-slice-percent' }) minSlicePercent = 1;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property({ attribute: false }) formatValue?: (value: number) => string;
  @property({ attribute: false }) formatPercent?: (percent: number) => string;

  @state() private _activeIndex: number | null = null;
  @state() private _focusMode: 'keyboard' | 'pointer' | null = null;

  #slices(): PieSlice[] {
    return preparePieSlices(this.data, {
      maxSlices: this.maxSlices,
      otherThreshold: this.otherThreshold,
      otherLabel: this.otherLabel,
      includeZeroSlices: this.includeZeroSlices,
      minSlicePercent: this.minSlicePercent,
    });
  }

  #context(slices: readonly PieSlice[]): PieRenderContext {
    return {
      uid: this.uid,
      title: this.title,
      donut: this.donut,
      innerRadius: this.innerRadius,
      showPercentages: this.showPercentages,
      total: sliceTotal(slices),
      activeIndex: this._activeIndex,
      focusMode: this._focusMode,
      sliceColor: (slice, index) => slice.color ?? colorForIndex(index),
      formatValue: value => (this.formatValue ? this.formatValue(value) : String(value)),
      formatPercent: percent =>
        this.formatPercent ? this.formatPercent(percent) : `${Math.round(percent)}%`,
    };
  }

  override render(): TemplateResult {
    const slices = this.#slices();
    const ctx = this.#context(slices);
    if (this.loading) {
      return this.#renderLoading();
    }
    if (slices.length === 0) {
      return html`
        <div class="frame" part="chart" style="height:${this.size}px">
          <div class="empty">No data</div>
        </div>
      `;
    }
    return html`
      <div
        class="frame"
        part="chart"
        @keydown=${this.#onKeydown}
        @focusin=${this.#onFocusIn}
        @focusout=${this.#onFocusOut}
        @click=${this.#onClick}
      >
        <div
          class="canvas"
          style="--pie-size:${this.size}px"
          @pointerover=${this.#onPointerOver}
          @pointerleave=${this.#onPointerLeave}
        >
          ${renderPieSvg(ctx, slices)} ${renderDonutCenter(ctx)} ${renderPieTooltip(ctx, slices)}
        </div>
        ${this.showLegend ? renderPieLegend(ctx, slices) : nothing}
      </div>
      ${renderChartTitle(this.uid, pieSummaryText(ctx, slices))} ${renderPieSrTable(ctx, slices)}
      ${renderChartLiveRegion(pieLiveText(ctx, slices))}
    `;
  }

  #renderLoading(): TemplateResult {
    return html`
      <div class="frame" part="chart" aria-busy="true" aria-label=${this.title || 'Pie chart'}>
        <div class="canvas" style="--pie-size:${this.size}px">
          <ds-skeleton variant="circle" width="100%" height="100%"></ds-skeleton>
        </div>
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
    this.#emitSlice('ds-slice-focus', index);
  }

  #emitSlice(name: 'ds-slice-focus' | 'ds-slice-select', index: number): void {
    const slice = this.#slices()[index];
    if (!slice) {
      return;
    }
    this.emit(name, {
      detail: {
        index,
        label: slice.label,
        value: slice.value,
        percent: slice.percent,
        isOther: slice.isOther,
      },
    });
  }

  #onKeydown = (event: KeyboardEvent): void => {
    const count = this.#slices().length;
    if (count === 0) {
      return;
    }
    if (event.key === 'Escape') {
      this._focusMode = null;
      this.#setActive(null);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      if (this._activeIndex != null) {
        event.preventDefault();
        this.#emitSlice('ds-slice-select', this._activeIndex);
      }
      return;
    }
    const next = resolveRovingTarget({ key: event.key, currentIndex: this._activeIndex ?? -1, count });
    if (next == null) {
      return;
    }
    event.preventDefault();
    this._focusMode = 'keyboard';
    this.#setActive(next);
    void this.updateComplete.then(() => focusDatum(this.shadowRoot, this.uid, 'slice', next));
  };

  #onFocusIn = (event: FocusEvent): void => {
    const index = sliceIndexFrom(event.target);
    if (index == null) {
      return;
    }
    this._focusMode = isKeyboardFocus(event.target) ? 'keyboard' : 'pointer';
    this.#setActive(index);
  };

  #onFocusOut = (event: FocusEvent): void => {
    if (this.contains(event.relatedTarget as Node) || this.shadowRoot?.contains(event.relatedTarget as Node)) {
      return;
    }
    this._focusMode = null;
    this.#setActive(null);
  };

  #onClick = (event: MouseEvent): void => {
    const index = sliceIndexFrom(event.target);
    if (index != null) {
      this.#emitSlice('ds-slice-select', index);
    }
  };

  #onPointerOver = (event: PointerEvent): void => {
    const index = sliceIndexFrom(event.target);
    if (index == null || this._focusMode === 'keyboard') {
      return;
    }
    this._focusMode = 'pointer';
    this.#setActive(index);
  };

  #onPointerLeave = (): void => {
    if (this._focusMode !== 'pointer') {
      return;
    }
    this._focusMode = null;
    this.#setActive(null);
  };
}
