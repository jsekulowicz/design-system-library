import { html, nothing, type TemplateResult } from 'lit';
import { computeActiveGroupHeight, type ChartLayout } from './chart-layout.js';
import type { BarChartGroup, BarChartRow, ChartRenderContext } from './types.js';
import { formatLabel } from '../../shared/format-label.js';
import { renderPointTooltip } from '../../shared/point-tooltip.js';

export function getRootAriaLabel(ctx: ChartRenderContext, groupCount: number): string {
  const template = ctx.stacked ? ctx.stackedSummaryLabel : ctx.summaryLabel;
  return formatLabel(template, {
    title: ctx.title || ctx.chartLabel,
    groups: groupCount,
    series: ctx.series.map((series) => ctx.seriesLabel(series)).join(', '),
  });
}

export function getGroupAriaLabel<T extends BarChartRow>(ctx: ChartRenderContext, group: BarChartGroup<T>): string {
  const parts = ctx.series.map(
    (series) => `${ctx.seriesLabel(series)} ${ctx.formatValue(group.values[series.key] ?? 0)}`,
  );
  const total = ctx.stacked ? formatLabel(ctx.groupTotalLabel, { total: ctx.formatValue(group.total) }) : '';
  return `${ctx.formatTooltipTitle(group.domain)}: ${parts.join(', ')}${total}`;
}

export function getLiveText<T extends BarChartRow>(ctx: ChartRenderContext, groups: BarChartGroup<T>[]): string {
  if (ctx.activeIndex === null) {
    return '';
  }
  const group = groups[ctx.activeIndex];
  if (!group) {
    return '';
  }
  return `${getGroupAriaLabel(ctx, group)}.`;
}

export function renderTooltip<T extends BarChartRow>(ctx: ChartRenderContext, layout: ChartLayout<T>): TemplateResult {
  const { bands, groups, margin, innerHeight } = layout;
  const group = ctx.activeIndex !== null ? groups[ctx.activeIndex] : undefined;
  const band = ctx.activeIndex !== null ? bands[ctx.activeIndex] : undefined;
  const x = band ? margin.left + band.innerX + band.innerWidth / 2 : 0;
  const maxHeight = computeActiveGroupHeight(layout, ctx.activeIndex, ctx.stacked);
  const barTopY = margin.top + (innerHeight - maxHeight);
  return renderPointTooltip({
    open: ctx.activeIndex !== null,
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
                  (series, seriesIndex) => html`
                    <li class="tooltip-row-label">
                      <span class="tooltip-swatch" style="background:${ctx.seriesColor(series, seriesIndex)}"></span>
                      ${ctx.seriesLabel(series)}
                    </li>
                    <li class="tooltip-row-value">${ctx.formatValue(group.values[series.key] ?? 0)}</li>
                  `,
                )}
                ${
                  ctx.stacked
                    ? html`
                        <li class="tooltip-row-label">${ctx.totalHeader}</li>
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
        (series, i) => html`
          <span class="legend-item">
            <span class="legend-swatch" style="background:${ctx.seriesColor(series, i)}"></span>
            ${ctx.seriesLabel(series)}
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
          ${ctx.title || ctx.dataTableLabel}
        </caption>
        <thead>
          <tr>
            <th scope="col">${ctx.xAxisLabel ?? ctx.domainKey}</th>
            ${ctx.series.map((series) => html`<th scope="col">${ctx.seriesLabel(series)}</th>`)}
            ${ctx.stacked ? html`<th scope="col">${ctx.totalHeader}</th>` : nothing}
          </tr>
        </thead>
        <tbody>
          ${groups.map(
            (group) => html`
              <tr>
                <th scope="row">${ctx.formatDomain(group.domain)}</th>
                ${ctx.series.map((series) => {
                  return html`<td>${ctx.formatValue(group.values[series.key] ?? 0)}</td>`;
                })}
                ${ctx.stacked ? html`<td>${ctx.formatValue(group.total)}</td>` : nothing}
              </tr>
            `,
          )}
        </tbody>
      </table>
    </div>
  `;
}
