import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { focusDatum, renderChartLiveRegion, renderChartTitle } from '../../shared/chart-a11y.js';
import { heatmapCalendarStyles } from './heatmap-calendar.styles.js';
import { pointTooltipStyles } from '../../shared/point-tooltip.styles.js';
import { computeHeatmapLayout, parseDate } from './heatmap-layout.js';
import { getActionForKey } from './heatmap-interaction.js';
import { HeatmapActiveDay } from './heatmap-active-day.js';
import { createDefaultDateFormatter, createMonthFormatter, todayDate, getWeekdayLabels } from './heatmap-formatters.js';
import { computeHeatmapDimensions, renderHeatmapSvg } from './heatmap-calendar-svg.js';
import {
  getHeatmapAriaLabel,
  getHeatmapLiveText,
  renderHeatmapLegend,
  renderHeatmapSrTable,
  renderHeatmapAnchor,
  renderHeatmapTooltip,
} from './heatmap-calendar-overlays.js';
import type {
  HeatmapCell,
  HeatmapDay,
  HeatmapFocusDetail,
  HeatmapLayout,
  HeatmapRenderContext,
  HeatmapWeekStart,
} from './types.js';

/**
 * @tag ds-heatmap-calendar
 * @summary Calendar heatmap with accessible data table, tooltips, and keyboard navigation.
 * @event {CustomEvent<HeatmapFocusDetail>} ds-heatmap-focus - Emitted when the active day changes. Detail: `{ date, value, level, details? }`.
 * @csspart chart - The calendar frame, including the focusable day cells and the legend.
 * @csspart scroller - The horizontally scrollable calendar viewport.
 * @csspart tooltip - The floating tooltip container. Rendered in the Popover API top layer and positioned against the active data point with CSS anchor positioning, so ancestor overflow cannot clip it.
 * @cssprop [--ds-point-tooltip-min-width=8rem] - Minimum tooltip width.
 * @cssprop [--ds-point-tooltip-max-width=18rem] - Maximum tooltip width before the viewport cap applies.
 * @csspart legend - The value intensity legend.
 * @cssprop [--ds-heatmap-cell-radius=var(--ds-radius-xs)] - Corner radius of the day cells and the legend cells.
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

  readonly #activeDay = new HeatmapActiveDay(this, (index) => this.#emitFocus(index));

  override willUpdate(changed: PropertyValues): void {
    if (this.loading || ['endDate', 'months', 'weekStart'].some((property) => changed.has(property))) {
      this.#activeDay.reconcile(this.loading ? 0 : this.#layout().cells.length);
    }
  }

  override render(): TemplateResult {
    const layout = this.#layout();
    const ctx = this.#context();
    if (this.loading) {
      const dimensions = computeHeatmapDimensions(ctx, layout);
      return html`
        <div class="frame" part="chart" aria-busy="true" aria-label=${this.title || this.calendarLabel}>
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
        <div
          class="scroller"
          part="scroller"
          @pointermove=${this.#onPointerMove}
          @pointerleave=${this.#returnToFocusedDay}
          @click=${this.#onClick}
        >
          <div class="canvas">${renderHeatmapSvg(ctx, layout)}${renderHeatmapAnchor(ctx, layout)}</div>
        </div>
        ${renderHeatmapTooltip(ctx, layout)} ${this.showLegend ? renderHeatmapLegend(ctx) : nothing}
      </div>
      ${renderChartTitle(this.uid, getHeatmapAriaLabel(ctx, layout))} ${renderHeatmapSrTable(ctx, layout)}
      ${renderChartLiveRegion(getHeatmapLiveText(ctx, layout))}
    `;
  }

  #layout(): HeatmapLayout {
    const endDate = parseDate(this.endDate) ? this.endDate : todayDate();
    const weekStart = this.weekStart === 'sunday' ? 'sunday' : 'monday';
    return computeHeatmapLayout(this.data, endDate, Math.max(1, this.months), weekStart);
  }

  #context(): HeatmapRenderContext {
    const formatDate = this.formatDate ?? createDefaultDateFormatter(this.locale);
    return {
      uid: this.uid,
      title: this.title,
      color: this.color,
      cellSize: Math.max(4, this.cellSize),
      cellGap: Math.max(0, this.cellGap),
      activeIndex: this.#activeDay.activeIndex,
      tabbableIndex: this.#activeDay.tabbableIndex,
      tooltipShown: this.#activeDay.tooltipShown,
      formatValue: (value) => this.formatValue?.(value) ?? String(value),
      formatDate,
      formatMonth: createMonthFormatter(this.locale),
      weekdayLabels: getWeekdayLabels(this.locale, this.weekStart),
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

  #emitFocus(index: number): void {
    const cell = this.#layout().cells[index];
    if (cell) {
      this.emit<HeatmapFocusDetail>('ds-heatmap-focus', { detail: toFocusDetail(cell) });
    }
  }

  #onKeydown = (event: KeyboardEvent): void => {
    const action = getActionForKey(event.key, this.#activeDay.tabbableIndex, this.#layout().cells.length);
    if (!action) {
      return;
    }
    event.preventDefault();
    this.#activeDay.focus(action.index);
    void this.updateComplete.then(() => focusDatum(this.shadowRoot, this.uid, 'day', action.index));
  };

  #onFocusIn = (event: FocusEvent): void => {
    const index = getCellIndexFrom(event.target);
    if (index !== null) {
      this.#activeDay.focus(index);
    }
  };

  #onFocusOut = (event: FocusEvent): void => {
    if (!this.shadowRoot?.contains(event.relatedTarget as Node)) {
      this.#activeDay.blur();
    }
  };

  #onPointerMove = (event: PointerEvent): void => {
    const index = getCellIndexFrom(event.composedPath()[0] ?? null);
    if (index !== null) {
      this.#activeDay.activate(index);
    }
  };

  #onClick = (event: MouseEvent): void => {
    const index = getCellIndexFrom(event.composedPath()[0] ?? null);
    if (index !== null) {
      this.#activeDay.focus(index);
    }
  };

  #returnToFocusedDay = (): void => {
    this.#activeDay.returnToFocusedDay();
  };
}

function toFocusDetail({ date, value, level, details }: HeatmapCell): HeatmapFocusDetail {
  return details ? { date, value, level, details } : { date, value, level };
}

function getCellIndexFrom(target: EventTarget | null): number | null {
  const cell = target instanceof Element ? target.closest('.cell') : null;
  const index = cell?.getAttribute('data-index') ?? null;
  return index === null ? null : Number(index);
}
