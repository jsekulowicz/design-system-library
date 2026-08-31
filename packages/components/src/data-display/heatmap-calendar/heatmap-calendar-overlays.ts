import { html, type TemplateResult } from 'lit';
import { HEATMAP_LEFT, HEATMAP_TOP } from './heatmap-calendar-svg.js';
import { cellAriaLabel } from './heatmap-formatters.js';
import type { HeatmapCell, HeatmapLayout, HeatmapRenderContext } from './types.js';
import { renderPointAnchor, renderPointTooltipBubble } from '../../shared/point-tooltip.js';
import { formatLabel } from '../../shared/format-label.js';

function activeCell(ctx: HeatmapRenderContext, layout: HeatmapLayout): HeatmapCell | undefined {
  return ctx.activeIndex == null ? undefined : layout.cells[ctx.activeIndex];
}

export function heatmapAriaLabel(ctx: HeatmapRenderContext, layout: HeatmapLayout): string {
  return formatLabel(ctx.summaryLabel, {
    title: ctx.title || ctx.calendarLabel,
    days: layout.cells.length,
  });
}

export function heatmapLiveText(ctx: HeatmapRenderContext, layout: HeatmapLayout): string {
  const cell = activeCell(ctx, layout);
  return cell ? `${cellAriaLabel(ctx, cell)}.` : '';
}

export function renderHeatmapAnchor(ctx: HeatmapRenderContext, layout: HeatmapLayout): TemplateResult {
  const cell = activeCell(ctx, layout);
  const step = ctx.cellSize + ctx.cellGap;
  const left = cell ? HEATMAP_LEFT + cell.column * step + ctx.cellSize / 2 : 0;
  const top = cell ? HEATMAP_TOP + cell.row * step + ctx.cellSize / 2 : 0;
  return renderPointAnchor(`${left}px`, `${top}px`);
}

export function renderHeatmapTooltip(ctx: HeatmapRenderContext, layout: HeatmapLayout): TemplateResult {
  const cell = activeCell(ctx, layout);
  return renderPointTooltipBubble({
    area: cell && cell.row < 2 ? 'bottom' : 'top',
    open: Boolean(cell),
    content: html`
      ${
        cell
          ? html`
              <div class="tooltip-title">${ctx.formatValue(cell.value)}</div>
              <div class="tooltip-date">${ctx.formatDate(cell.date)}</div>
            `
          : ''
      }
    `,
  });
}

export function renderHeatmapLegend(ctx: HeatmapRenderContext): TemplateResult {
  return html`
    <div class="legend" part="legend" aria-label=${ctx.legendLabel}>
      <span>${ctx.legendLessLabel}</span>
      ${[0, 1, 2, 3, 4].map(
        (level) => html`<span class="legend-cell level-${level}" style="--heatmap-color:${ctx.color}"></span>`,
      )}
      <span>${ctx.legendMoreLabel}</span>
    </div>
  `;
}

export function renderHeatmapSrTable(ctx: HeatmapRenderContext, layout: HeatmapLayout): TemplateResult {
  return html`
    <div class="visually-hidden" id="${ctx.uid}-desc">
      <table>
        <caption>
          ${ctx.title || ctx.dataTableLabel}
        </caption>
        <thead>
          <tr>
            <th scope="col">${ctx.dateHeader}</th>
            <th scope="col">${ctx.valueHeader}</th>
          </tr>
        </thead>
        <tbody>
          ${layout.cells.map(
            (cell) => html`
              <tr>
                <th scope="row">${ctx.formatDate(cell.date)}</th>
                <td>${ctx.formatValue(cell.value)}</td>
              </tr>
            `,
          )}
        </tbody>
      </table>
    </div>
  `;
}
