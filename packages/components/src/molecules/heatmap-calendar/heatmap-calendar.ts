import { html, nothing, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { heatmapCalendarStyles } from './heatmap-calendar.styles.js';
import { computeHeatmapLayout, parseDate } from './heatmap-layout.js';
import { actionForKey } from './heatmap-interaction.js';
import {
  defaultDateFormatter,
  monthFormatter,
  todayDate,
  weekdayLabels,
} from './heatmap-formatters.js';
import { renderHeatmapSvg } from './heatmap-calendar-svg.js';
import {
  heatmapAriaLabel,
  heatmapLiveText,
  renderHeatmapLegend,
  renderHeatmapSrTable,
  renderHeatmapTooltip,
} from './heatmap-calendar-overlays.js';
import type { HeatmapDay, HeatmapLayout, HeatmapRenderContext, HeatmapWeekStart } from './types.js';

/**
 * @tag ds-heatmap-calendar
 * @summary Calendar heatmap with accessible data table, tooltips, and keyboard navigation.
 * @event ds-heatmap-focus - Emitted when the active day changes. Detail: `{ date, value, level }`.
 * @csspart chart - The scrollable calendar frame.
 * @csspart tooltip - The floating tooltip container.
 * @csspart legend - The value intensity legend.
 */
export class DsHeatmapCalendar extends DsElement {
  static override styles = [...DsElement.styles, heatmapCalendarStyles];

  @property({ attribute: false }) data: readonly HeatmapDay[] = [];
  @property({ attribute: 'end-date' }) endDate = todayDate();
  @property({ type: Number }) months = 12;
  @property({ attribute: 'week-start' }) weekStart: HeatmapWeekStart = 'monday';
  @property() override title = '';
  @property({ type: Number, attribute: 'cell-size' }) cellSize = 12;
  @property({ type: Number, attribute: 'cell-gap' }) cellGap = 3;
  @property({ type: Boolean, reflect: true, attribute: 'show-legend' }) showLegend = true;
  @property() color = 'var(--ds-color-chart-1)';
  @property({ attribute: false }) formatValue?: (value: number) => string;
  @property({ attribute: false }) formatDate?: (date: string) => string;
  @property() locale?: string;

  @state() private _width = 0;
  @state() private _activeIndex: number | null = null;
  @state() private _focusMode: 'keyboard' | 'pointer' | null = null;
  @query('.frame') private _frame!: HTMLElement;
  #resizeObserver?: ResizeObserver;

  override firstUpdated(): void {
    this.#observeResize();
    if (typeof requestAnimationFrame !== 'undefined') {
      requestAnimationFrame(() => this.#measure());
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#resizeObserver?.disconnect();
    this.#resizeObserver = undefined;
  }

  override render(): TemplateResult {
    const layout = this.#layout();
    const ctx = this.#context();
    return html`
      <div
        class="frame"
        part="chart"
        tabindex="0"
        role="application"
        aria-label=${heatmapAriaLabel(ctx, layout)}
        aria-describedby="${this.uid}-desc"
        aria-activedescendant=${this._activeIndex == null
          ? nothing
          : `${this.uid}-day-${this._activeIndex}`}
        @keydown=${this.#onKeydown}
        @pointermove=${this.#onPointerMove}
        @pointerleave=${this.#clearPointer}
        @blur=${this.#clearActive}
      >
        <div class="canvas" style="--heatmap-viewport-width:${this._width}px">
          ${renderHeatmapSvg(ctx, layout)} ${renderHeatmapTooltip(ctx, layout)}
        </div>
        ${renderHeatmapSrTable(ctx, layout)}
        <div class="visually-hidden" role="status" aria-live="polite">
          ${heatmapLiveText(ctx, layout)}
        </div>
      </div>
      ${this.showLegend ? renderHeatmapLegend(ctx) : nothing}
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
  };

  #onPointerMove = (event: PointerEvent): void => {
    const target = event.composedPath().find((item) => item instanceof SVGRectElement) as
      | SVGRectElement
      | undefined;
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
    const width = this._frame?.clientWidth ?? 0;
    if (width > 0) {
      this._width = width;
    }
  }

  #observeResize(): void {
    if (!this._frame || typeof ResizeObserver === 'undefined') {
      return;
    }
    this.#resizeObserver = new ResizeObserver((entries) => {
      this._width = Math.max(0, entries[0]?.contentRect.width ?? 0);
    });
    this.#resizeObserver.observe(this._frame);
  }
}
