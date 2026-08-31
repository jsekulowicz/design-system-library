import { html, nothing, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { focusDatum, renderChartLiveRegion, renderChartTitle } from '../../shared/chart-a11y.js';
import { heatmapCalendarStyles } from './heatmap-calendar.styles.js';
import { pointTooltipStyles } from '../../shared/point-tooltip.styles.js';
import { syncPointTooltip } from '../../shared/point-tooltip.js';
import { computeHeatmapLayout, parseDate } from './heatmap-layout.js';
import { actionForKey } from './heatmap-interaction.js';
import { defaultDateFormatter, monthFormatter, todayDate, weekdayLabels } from './heatmap-formatters.js';
import { heatmapDimensions, renderHeatmapSvg } from './heatmap-calendar-svg.js';
import {
  heatmapAriaLabel,
  heatmapLiveText,
  renderHeatmapLegend,
  renderHeatmapSrTable,
  renderHeatmapAnchor,
  renderHeatmapTooltip,
} from './heatmap-calendar-overlays.js';
import type { HeatmapDay, HeatmapLayout, HeatmapRenderContext, HeatmapWeekStart } from './types.js';

/**
 * @tag ds-heatmap-calendar
 * @summary Calendar heatmap with accessible data table, tooltips, and keyboard navigation.
 * @event ds-heatmap-focus - Emitted when the active day changes. Detail: `{ date, value, level }`.
 * @csspart chart - The focusable calendar frame, including the legend.
 * @csspart scroller - The horizontally scrollable calendar viewport.
 * @csspart tooltip - The floating tooltip container. Rendered in the Popover API top layer and positioned against the active data point with CSS anchor positioning, so ancestor overflow cannot clip it.
 * @cssprop [--ds-point-tooltip-min-width=8rem] - Minimum tooltip width.
 * @cssprop [--ds-point-tooltip-max-width=14rem] - Maximum tooltip width before the viewport cap applies.
 * @csspart legend - The value intensity legend.
 */
export class DsHeatmapCalendar extends DsElement {
  static override styles = [...DsElement.styles, heatmapCalendarStyles, pointTooltipStyles];

  @property({ attribute: false }) data: readonly HeatmapDay[] = [];
  @property({ attribute: 'end-date' }) endDate = todayDate();
  @property({ type: Number }) months = 12;
  @property({ attribute: 'week-start' }) weekStart: HeatmapWeekStart = 'monday';
  @property() override title = '';
  @property({ type: Number, attribute: 'cell-size' }) cellSize = 12;
  @property({ type: Number, attribute: 'cell-gap' }) cellGap = 3;
  @property({ type: Boolean, reflect: true, attribute: 'show-legend' }) showLegend = true;
  @property({ type: Boolean, reflect: true }) loading = false;
  @property() color = 'var(--ds-color-chart-1)';
  @property({ attribute: false }) formatValue?: (value: number) => string;
  @property({ attribute: false }) formatDate?: (date: string) => string;
  @property() locale?: string;
  @property({ attribute: 'calendar-label' }) calendarLabel = 'Activity calendar';
  @property({ attribute: 'data-table-label' }) dataTableLabel = 'Activity calendar data';
  @property({ attribute: 'summary-label' }) summaryLabel = '{title}: {days} days.';
  @property({ attribute: 'legend-label' }) legendLabel = 'Value intensity from less to more';
  @property({ attribute: 'legend-less-label' }) legendLessLabel = 'Less';
  @property({ attribute: 'legend-more-label' }) legendMoreLabel = 'More';
  @property({ attribute: 'date-header' }) dateHeader = 'Date';
  @property({ attribute: 'value-header' }) valueHeader = 'Value';
  @property({ attribute: 'role-description' }) roleDescription = 'activity calendar';

  @state() private _width = 0;
  @state() private _activeIndex: number | null = null;
  @state() private _focusMode: 'keyboard' | 'pointer' | null = null;
  @query('.scroller') private _scroller!: HTMLElement;
  #resizeObserver?: ResizeObserver;

  override firstUpdated(): void {
    this.#observeResize();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => this.#measure());
    }
  }

  override updated(): void {
    syncPointTooltip(this.shadowRoot, this._activeIndex != null);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
  }

  override render(): TemplateResult {
    const layout = this.#layout();
    const ctx = this.#context();
    if (this.loading) {
      const dimensions = heatmapDimensions(ctx, layout);
      return html`
        <div class="frame loading-frame" part="chart" aria-busy="true" aria-label=${this.title || this.calendarLabel}>
          <div class="scroller" part="scroller">
            <ds-skeleton
              variant="rectangle"
              width="${dimensions.width}px"
              height="${dimensions.height}px"
            ></ds-skeleton>
          </div>
          ${this.showLegend ? renderHeatmapLegend(ctx) : nothing}
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
      >
        <div class="scroller" part="scroller" @pointermove=${this.#onPointerMove} @pointerleave=${this.#clearPointer}>
          <div class="canvas" style="--heatmap-viewport-width:${this._width}px">
            ${renderHeatmapSvg(ctx, layout)}${renderHeatmapAnchor(ctx, layout)}
          </div>
        </div>
        ${renderHeatmapTooltip(ctx, layout)} ${this.showLegend ? renderHeatmapLegend(ctx) : nothing}
      </div>
      ${renderChartTitle(this.uid, heatmapAriaLabel(ctx, layout))} ${renderHeatmapSrTable(ctx, layout)}
      ${renderChartLiveRegion(heatmapLiveText(ctx, layout))}
    `;
  }

  #layout(): HeatmapLayout {
    const endDate = parseDate(this.endDate) ? this.endDate : todayDate();
    const weekStart = this.weekStart === 'sunday' ? 'sunday' : 'monday';
    return computeHeatmapLayout(this.data, endDate, Math.max(1, this.months), weekStart);
  }

  #context(): HeatmapRenderContext {
    const formatDate = this.formatDate ?? defaultDateFormatter(this.locale);
    return {
      uid: this.uid,
      title: this.title,
      color: this.color,
      cellSize: Math.max(4, this.cellSize),
      cellGap: Math.max(0, this.cellGap),
      measuredWidth: this._width,
      activeIndex: this._activeIndex,
      focusMode: this._focusMode,
      formatValue: (value) => this.formatValue?.(value) ?? String(value),
      formatDate,
      formatMonth: monthFormatter(this.locale),
      weekdayLabels: weekdayLabels(this.locale, this.weekStart),
      calendarLabel: this.calendarLabel,
      dataTableLabel: this.dataTableLabel,
      summaryLabel: this.summaryLabel,
      legendLabel: this.legendLabel,
      legendLessLabel: this.legendLessLabel,
      legendMoreLabel: this.legendMoreLabel,
      dateHeader: this.dateHeader,
      valueHeader: this.valueHeader,
      roleDescription: this.roleDescription,
    };
  }

  #setActive(index: number | null): void {
    if (this._activeIndex === index) {
      return;
    }
    this._activeIndex = index;
    const cell = index == null ? undefined : this.#layout().cells[index];
    if (cell) {
      this.emit('ds-heatmap-focus', {
        detail: { date: cell.date, value: cell.value, level: cell.level },
      });
    }
  }

  #onKeydown = (event: KeyboardEvent): void => {
    const action = actionForKey(event.key, this._activeIndex, this.#layout().cells.length);
    if (!action) {
      return;
    }
    event.preventDefault();
    if ('clear' in action) {
      this.#clearActive();
      return;
    }
    this._focusMode = 'keyboard';
    this.#setActive(action.index);
    void this.updateComplete.then(() => focusDatum(this.shadowRoot, this.uid, 'day', action.index));
  };

  #onFocusIn = (event: FocusEvent): void => {
    const index = cellIndexFrom(event.target);
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
    this.#clearActive();
  };

  #onPointerMove = (event: PointerEvent): void => {
    const target = event.composedPath().find((item) => item instanceof SVGRectElement) as SVGRectElement | undefined;
    const index = Number(target?.dataset['index']);
    if (Number.isInteger(index)) {
      this._focusMode = 'pointer';
      this.#setActive(index);
    }
  };

  #clearPointer = (): void => {
    if (this._focusMode === 'pointer') {
      this.#clearActive();
    }
  };

  #clearActive = (): void => {
    this._focusMode = null;
    this.#setActive(null);
  };

  #measure(): void {
    const width = this._scroller?.clientWidth ?? 0;
    if (width > 0) {
      this._width = width;
    }
  }

  #observeResize(): void {
    if (!this._scroller || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.#resizeObserver = new ResizeObserver((entries) => {
      this._width = Math.max(0, entries[0]?.contentRect.width ?? 0);
    });
    this.#resizeObserver.observe(this._scroller);
  }
}

function cellIndexFrom(target: EventTarget | null): number | null {
  const cell = target instanceof Element ? target.closest('.cell') : null;
  const index = cell?.getAttribute('data-index');
  return index == null ? null : Number(index);
}
