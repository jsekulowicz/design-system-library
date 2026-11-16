import { svg, type SVGTemplateResult } from 'lit';
import { getChartTitleId, getDatumId, getRovingTabIndex } from '../../shared/chart-a11y.js';
import { getCellAriaLabel } from './heatmap-formatters.js';
import type { HeatmapLayout, HeatmapRenderContext } from './types.js';

export const HEATMAP_LEFT = 34;
export const HEATMAP_TOP = 24;

export function computeHeatmapDimensions(
  ctx: HeatmapRenderContext,
  layout: HeatmapLayout,
): { width: number; height: number } {
  const step = ctx.cellSize + ctx.cellGap;
  return {
    width: HEATMAP_LEFT + Math.max(0, layout.weekCount * step - ctx.cellGap),
    height: HEATMAP_TOP + 7 * step - ctx.cellGap,
  };
}

function getLevelColor(ctx: HeatmapRenderContext, level: number): string {
  if (level === 0) {
    return 'var(--ds-color-bg-muted)';
  }
  const strengths = [0, 30, 55, 80, 100];
  return `color-mix(in oklab, ${ctx.color} ${strengths[level]}%, var(--ds-color-bg-subtle))`;
}

export function renderHeatmapSvg(ctx: HeatmapRenderContext, layout: HeatmapLayout): SVGTemplateResult {
  const { width, height } = computeHeatmapDimensions(ctx, layout);
  const step = ctx.cellSize + ctx.cellGap;
  return svg`
    <svg
      role="graphics-document"
      aria-roledescription=${ctx.roleDescription}
      aria-labelledby=${getChartTitleId(ctx.uid)}
      width=${width}
      height=${height}
      viewBox="0 0 ${width} ${height}"
    >
      <g class="month-labels" aria-hidden="true">
        ${layout.monthLabels.map(
          (label) => svg`
          <text x=${HEATMAP_LEFT + label.column * step} y="12">${ctx.formatMonth(label.date)}</text>
        `,
        )}
      </g>
      <g class="weekday-labels" aria-hidden="true">
        ${[0, 2, 4].map(
          (row) => svg`
          <text x="0" y=${HEATMAP_TOP + row * step + ctx.cellSize - 2}>${ctx.weekdayLabels[row]}</text>
        `,
        )}
      </g>
      <g class="cells">
        ${layout.cells.map(
          (cell, index) => svg`
          <rect
            id=${getDatumId(ctx.uid, 'day', index)}
            class="cell level-${cell.level} ${ctx.activeIndex === index ? 'active' : ''}"
            data-index=${index}
            role="graphics-symbol"
            tabindex=${getRovingTabIndex(index, ctx.tabbableIndex)}
            aria-label=${getCellAriaLabel(ctx, cell)}
            x=${HEATMAP_LEFT + cell.column * step}
            y=${HEATMAP_TOP + cell.row * step}
            width=${ctx.cellSize}
            height=${ctx.cellSize}
            fill=${getLevelColor(ctx, cell.level)}
          ></rect>
        `,
        )}
      </g>
    </svg>
  `;
}
