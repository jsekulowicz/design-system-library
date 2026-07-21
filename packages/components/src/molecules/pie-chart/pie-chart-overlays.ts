import { html, nothing, type TemplateResult } from 'lit';
import { LABEL_RADIUS, VIEWBOX_SIZE, midAngle, polarPoint } from './pie-geometry.js';
import type { PieRenderContext, PieSlice } from './types.js';

export function sliceAriaLabel(ctx: PieRenderContext, slice: PieSlice): string {
  return `${slice.label}: ${ctx.formatValue(slice.value)}, ${ctx.formatPercent(slice.percent)}`;
}

export function pieSummaryText(ctx: PieRenderContext, slices: readonly PieSlice[]): string {
  const shape = ctx.donut ? 'Donut chart' : 'Pie chart';
  const base = ctx.title || shape;
  return `${base}: ${slices.length} slices, total ${ctx.formatValue(ctx.total)}.`;
}

export function pieLiveText(ctx: PieRenderContext, slices: readonly PieSlice[]): string {
  if (ctx.activeIndex == null) {
    return '';
  }
  const slice = slices[ctx.activeIndex];
  if (!slice) {
    return '';
  }
  return `${sliceAriaLabel(ctx, slice)}.`;
}

function tooltipPosition(slice: PieSlice): { left: number; top: number } {
  const point = polarPoint(LABEL_RADIUS, midAngle(slice));
  return {
    left: (point.x / VIEWBOX_SIZE) * 100,
    top: (point.y / VIEWBOX_SIZE) * 100,
  };
}

export function renderPieTooltip(
  ctx: PieRenderContext,
  slices: readonly PieSlice[],
): TemplateResult {
  const slice = ctx.activeIndex == null ? undefined : slices[ctx.activeIndex];
  const position = slice ? tooltipPosition(slice) : { left: 50, top: 50 };
  return html`
    <div
      class="tooltip"
      part="tooltip"
      role="tooltip"
      aria-hidden="true"
      ?hidden=${!slice}
      style="left:${position.left}%; top:${position.top}%"
    >
      ${slice
        ? html`
            <div class="tooltip-title">${slice.label}</div>
            <div class="tooltip-row-value">
              ${ctx.formatValue(slice.value)} · ${ctx.formatPercent(slice.percent)}
            </div>
          `
        : nothing}
    </div>
  `;
}

export function renderPieLegend(ctx: PieRenderContext, slices: readonly PieSlice[]): TemplateResult {
  return html`
    <div class="legend" part="legend">
      ${slices.map(
        (slice, index) => html`
          <span class="legend-item">
            <span class="legend-swatch" style="background:${ctx.sliceColor(slice, index)}"></span>
            <span class="legend-label">${slice.label}</span>
            <span class="legend-value">
              ${ctx.formatValue(slice.value)} · ${ctx.formatPercent(slice.percent)}
            </span>
          </span>
        `,
      )}
    </div>
  `;
}

export function renderPieSrTable(ctx: PieRenderContext, slices: readonly PieSlice[]): TemplateResult {
  return html`
    <div class="visually-hidden">
      <table>
        <caption>${ctx.title || 'Pie chart data'}</caption>
        <thead>
          <tr>
            <th scope="col">Category</th>
            <th scope="col">Value</th>
            <th scope="col">Share</th>
          </tr>
        </thead>
        <tbody>
          ${slices.map(
            slice => html`
              <tr>
                <th scope="row">${slice.label}</th>
                <td>${ctx.formatValue(slice.value)}</td>
                <td>${ctx.formatPercent(slice.percent)}</td>
              </tr>
            `,
          )}
        </tbody>
        <tfoot>
          <tr>
            <th scope="row">Total</th>
            <td>${ctx.formatValue(ctx.total)}</td>
            <td>${ctx.formatPercent(100)}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  `;
}

export function renderDonutCenter(ctx: PieRenderContext): TemplateResult | typeof nothing {
  if (!ctx.donut) {
    return nothing;
  }
  return html`
    <div class="center" part="center" aria-hidden="true">
      <slot name="center">
        <span class="center-value">${ctx.formatValue(ctx.total)}</span>
        ${ctx.title ? html`<span class="center-label">${ctx.title}</span>` : nothing}
      </slot>
    </div>
  `;
}
