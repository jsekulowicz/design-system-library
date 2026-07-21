import { html, type TemplateResult } from 'lit';
import { HEATMAP_LEFT, HEATMAP_TOP } from './heatmap-calendar-svg.js';
import { cellAriaLabel } from './heatmap-formatters.js';
import type { HeatmapCell, HeatmapLayout, HeatmapRenderContext } from './types.js';

function activeCell(ctx: HeatmapRenderContext, layout: HeatmapLayout): HeatmapCell | undefined {
  return ctx.activeIndex == null ? undefined : layout.cells[ctx.activeIndex];
}

export function heatmapAriaLabel(ctx: HeatmapRenderContext, layout: HeatmapLayout): string {
  const title = ctx.title || 'Activity calendar';
  return `${title}: ${layout.cells.length} days.`;
}


export function heatmapLiveText(ctx: HeatmapRenderContext, layout: HeatmapLayout): string {
  const cell = activeCell(ctx, layout);
  return cell ? `${cellAriaLabel(ctx, cell)}.` : '';
}

export function renderHeatmapTooltip(
  ctx: HeatmapRenderContext,
  layout: HeatmapLayout,
): TemplateResult {
  const cell = activeCell(ctx, layout);
  const step = ctx.cellSize + ctx.cellGap;
  const placeBelow = Boolean(cell && cell.row < 2);
  const left = cell ? HEATMAP_LEFT + cell.column * step + ctx.cellSize / 2 : 0;
  const top = cell ? HEATMAP_TOP + cell.row * step + (placeBelow ? ctx.cellSize : 0) : 0;
  return html`
    <div
      class="tooltip"
      part="tooltip"
      role="tooltip"
      data-position=${placeBelow ? 'below' : 'above'}
      ?hidden=${!cell}
      style="--heatmap-tooltip-x:${left}px; --heatmap-tooltip-y:${top}px"
    >
      ${cell
        ? html`<strong>${ctx.formatValue(cell.value)}</strong
            ><span>${ctx.formatDate(cell.date)}</span>`
        : ''}
    </div>
  `;
}

export function renderHeatmapLegend(ctx: HeatmapRenderContext): TemplateResult {
  return html`
    <div class="legend" part="legend" aria-label="Value intensity from less to more">
      <span>Less</span>
      ${[0, 1, 2, 3, 4].map(
        (level) =>
          html`<span
            class="legend-cell level-${level}"
            style="--heatmap-color:${ctx.color}"
          ></span>`,
      )}
      <span>More</span>
    </div>
  `;
}

export function renderHeatmapSrTable(
  ctx: HeatmapRenderContext,
  layout: HeatmapLayout,
): TemplateResult {
  return html`
    <div class="visually-hidden" id="${ctx.uid}-desc">
      <table>
        <caption>
          ${ctx.title || 'Activity calendar data'}
        </caption>
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Value</th>
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
