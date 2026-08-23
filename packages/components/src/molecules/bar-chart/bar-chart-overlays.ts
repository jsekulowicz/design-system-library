import { html, nothing, type TemplateResult } from 'lit';
import { activeGroupHeight, type ChartLayout } from './chart-layout.js';
import type { BarChartGroup, BarChartRow, ChartRenderContext } from './types.js';
import { renderPointTooltip } from '../../shared/point-tooltip.js';

export function rootAriaLabel(ctx: ChartRenderContext, groupCount: number): string {
  const base = ctx.title || 'Bar chart';
  const seriesLabels = ctx.series.map((s) => ctx.seriesLabel(s)).join(', ');
  return `${base}: ${groupCount} ${ctx.stacked ? 'stacked ' : ''}groups, series: ${seriesLabels}.`;
}

export function groupAriaLabel<T extends BarChartRow>(ctx: ChartRenderContext, group: BarChartGroup<T>): string {
  const parts = ctx.series.map((s) => `${ctx.seriesLabel(s)} ${ctx.formatValue(group.values[s.key] ?? 0)}`);
  const total = ctx.stacked ? `, total ${ctx.formatValue(group.total)}` : '';
  return `${ctx.formatTooltipTitle(group.domain)}: ${parts.join(', ')}${total}`;
}

export function liveText<T extends BarChartRow>(ctx: ChartRenderContext, groups: BarChartGroup<T>[]): string {
  if (ctx.activeIndex == null) {
    return '';
  }
  const g = groups[ctx.activeIndex];
  if (!g) {
    return '';
  }
  return `${groupAriaLabel(ctx, g)}.`;
}

export function renderTooltip<T extends BarChartRow>(ctx: ChartRenderContext, layout: ChartLayout<T>): TemplateResult {
  const { bands, groups, margin, innerHeight } = layout;
  const group = ctx.activeIndex != null ? groups[ctx.activeIndex] : undefined;
  const band = ctx.activeIndex != null ? bands[ctx.activeIndex] : undefined;
  const x = band ? margin.left + band.innerX + band.innerWidth / 2 : 0;
  const maxHeight = activeGroupHeight(layout, ctx.activeIndex, ctx.stacked);
  const barTopY = margin.top + (innerHeight - maxHeight);
  return renderPointTooltip({
    open: ctx.activeIndex != null,
    left: `${x}px`,
    top: `${barTopY}px`,
    area: 'top',
    content: html`
      ${
        group
          ? html`
              <div class="tooltip-title">${ctx.formatTooltipTitle(group.domain)}</div>
              <ul class="tooltip-rows">
                ${ctx.series.map(
                  (s, si) => html`
                    <li class="tooltip-row-label">
                      <span class="tooltip-swatch" style="background:${ctx.seriesColor(s, si)}"></span>
                      ${ctx.seriesLabel(s)}
                    </li>
                    <li class="tooltip-row-value">${ctx.formatValue(group.values[s.key] ?? 0)}</li>
                  `,
                )}
                ${
                  ctx.stacked
                    ? html`
                        <li class="tooltip-row-label">Total</li>
                        <li class="tooltip-row-value">${ctx.formatValue(group.total)}</li>
                      `
                    : nothing
                }
              </ul>
            `
          : nothing
      }
    `,
  });
}

export function renderLegend(ctx: ChartRenderContext): TemplateResult {
  return html`
    <div class="legend" part="legend">
      ${ctx.series.map(
        (s, i) => html`
          <span class="legend-item">
            <span class="legend-swatch" style="background:${ctx.seriesColor(s, i)}"></span>
            ${ctx.seriesLabel(s)}
          </span>
        `,
      )}
    </div>
  `;
}

export function renderSrTable<T extends BarChartRow>(
  ctx: ChartRenderContext,
  groups: BarChartGroup<T>[],
): TemplateResult {
  return html`
    <div class="visually-hidden">
      <table>
        <caption>
          ${ctx.title || 'Bar chart data'}
        </caption>
        <thead>
          <tr>
            <th scope="col">${ctx.xAxisLabel ?? ctx.domainKey}</th>
            ${ctx.series.map((s) => html`<th scope="col">${ctx.seriesLabel(s)}</th>`)}
            ${ctx.stacked ? html`<th scope="col">Total</th>` : nothing}
          </tr>
        </thead>
        <tbody>
          ${groups.map(
            (g) => html`
              <tr>
                <th scope="row">${ctx.formatDomain(g.domain)}</th>
                ${ctx.series.map((s) => {
                  return html`<td>${ctx.formatValue(g.values[s.key] ?? 0)}</td>`;
                })}
                ${ctx.stacked ? html`<td>${ctx.formatValue(g.total)}</td>` : nothing}
              </tr>
            `,
          )}
        </tbody>
      </table>
    </div>
  `;
}
