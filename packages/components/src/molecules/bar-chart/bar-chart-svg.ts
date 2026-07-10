import { html, svg, nothing, type TemplateResult, type SVGTemplateResult } from 'lit';
import { computeGroupedBars, computeStackSegments, type GroupBand } from './layout.js';
import { activeGroupHeight, type ChartLayout } from './chart-layout.js';
import type { BarChartGroup, BarChartRow, ChartRenderContext } from './types.js';

const BAR_INNER_GAP = 2;
const MIN_SEGMENT_HEIGHT = 1;

export function renderChartSvg<T extends BarChartRow>(
  ctx: ChartRenderContext,
  layout: ChartLayout<T>,
  height: number,
): TemplateResult {
  const { ticks, innerHeight, innerWidth, width, margin, bands, groups, yMax } = layout;
  return html`
    <svg role="img" aria-hidden="true" viewBox="0 0 ${width} ${height}" width=${width} height=${height} preserveAspectRatio="none">
      <g transform="translate(${margin.left}, ${margin.top})">
        ${renderGrid(ticks, innerHeight, innerWidth, yMax)}
        ${renderYAxis(ctx, ticks, innerHeight, margin.left, yMax)}
        ${renderXAxis(ctx, groups, bands, innerHeight, margin)}
        ${renderBars(ctx, groups, bands, innerHeight, yMax)}
        ${renderFocusRing(ctx, layout)}
      </g>
    </svg>
  `;
}

function renderGrid(ticks: number[], innerHeight: number, innerWidth: number, yMax: number): SVGTemplateResult {
  return svg`
    <g class="grid" aria-hidden="true">
      ${ticks.map(tick => {
        const y = innerHeight - (tick / yMax) * innerHeight;
        return svg`<line x1="0" x2=${innerWidth} y1=${y} y2=${y}></line>`;
      })}
    </g>
  `;
}

function renderYAxis(ctx: ChartRenderContext, ticks: number[], innerHeight: number, marginLeft: number, yMax: number): SVGTemplateResult {
  return svg`
    <g class="axis axis-y" aria-hidden="true">
      <line x1="0" x2="0" y1="0" y2=${innerHeight}></line>
      ${ticks.map(tick => {
        const y = innerHeight - (tick / yMax) * innerHeight;
        return svg`
          <g transform="translate(0, ${y})">
            <line x1="-4" x2="0" y1="0" y2="0"></line>
            <text x="-8" y="0" text-anchor="end" dominant-baseline="middle">${ctx.formatValue(tick)}</text>
          </g>
        `;
      })}
      ${ctx.yAxisLabel
        ? svg`<text class="axis-label" transform="translate(${-marginLeft + 12}, ${innerHeight / 2}) rotate(-90)" text-anchor="middle">${ctx.yAxisLabel}</text>`
        : nothing}
    </g>
  `;
}

function xTickEvery(bandWidth: number): number {
  if (bandWidth >= 24) {
    return 1;
  }
  if (bandWidth >= 12) {
    return 2;
  }
  if (bandWidth >= 6) {
    return 4;
  }
  return Math.max(1, Math.ceil(32 / Math.max(1, bandWidth)));
}

function xLabelRotation(bandWidth: number): number {
  return bandWidth < 48 ? -35 : 0;
}

function renderXAxis<T extends BarChartRow>(
  ctx: ChartRenderContext,
  groups: BarChartGroup<T>[],
  bands: GroupBand[],
  innerHeight: number,
  margin: { bottom: number },
): SVGTemplateResult {
  const firstBand = bands[0]!;
  const lastBand = bands[bands.length - 1]!;
  const bandWidth = firstBand.bandWidth;
  const every = xTickEvery(bandWidth);
  const rotation = xLabelRotation(bandWidth);
  return svg`
    <g class="axis axis-x" aria-hidden="true" transform="translate(0, ${innerHeight})">
      <line x1="0" x2=${lastBand.x + lastBand.bandWidth} y1="0" y2="0"></line>
      ${groups.map((g, i) => {
        if (i % every !== 0) {
          return nothing;
        }
        const band = bands[i]!;
        const cx = band.x + band.bandWidth / 2;
        const text = ctx.formatDomain(g.domain);
        return svg`
          <g transform="translate(${cx}, 0)">
            <line x1="0" x2="0" y1="0" y2="4"></line>
            <text y="18" text-anchor=${rotation ? 'end' : 'middle'} transform=${rotation ? `rotate(${rotation}) translate(-4, -6)` : ''}>${text}</text>
          </g>
        `;
      })}
      ${ctx.xAxisLabel
        ? svg`<text class="axis-label" x=${lastBand.x / 2 + firstBand.bandWidth / 2} y=${margin.bottom - 8} text-anchor="middle">${ctx.xAxisLabel}</text>`
        : nothing}
    </g>
  `;
}

function renderBars<T extends BarChartRow>(
  ctx: ChartRenderContext,
  groups: BarChartGroup<T>[],
  bands: GroupBand[],
  innerHeight: number,
  yMax: number,
): SVGTemplateResult {
  return svg`${groups.map((g, gi) => {
    const band = bands[gi]!;
    const inactive = ctx.activeIndex != null && ctx.activeIndex !== gi ? 'inactive' : '';
    const content = ctx.stacked
      ? renderStackedBars(ctx, g, band, innerHeight, yMax)
      : renderGroupedBars(ctx, g, band, innerHeight, yMax);
    return svg`<g class="bar-group ${inactive}" id="${ctx.uid}-group-${gi}" data-index=${gi}>${content}</g>`;
  })}`;
}

function renderStackedBars<T extends BarChartRow>(
  ctx: ChartRenderContext,
  g: BarChartGroup<T>,
  band: GroupBand,
  innerHeight: number,
  yMax: number,
): SVGTemplateResult {
  const segments = computeStackSegments(g.values, ctx.series.map(s => s.key), innerHeight, yMax);
  return svg`${segments.map((seg, si) => {
    const s = ctx.series[si]!;
    const height = seg.value > 0 ? Math.max(MIN_SEGMENT_HEIGHT, seg.height) : 0;
    const y = innerHeight - (segments.slice(0, si + 1).reduce((a, v) => a + Math.max(v.value > 0 ? MIN_SEGMENT_HEIGHT : 0, v.height), 0));
    return svg`<rect class="bar" x=${band.innerX} y=${y} width=${band.innerWidth} height=${height} fill=${ctx.seriesColor(s, si)}></rect>`;
  })}`;
}

function renderGroupedBars<T extends BarChartRow>(
  ctx: ChartRenderContext,
  g: BarChartGroup<T>,
  band: GroupBand,
  innerHeight: number,
  yMax: number,
): SVGTemplateResult {
  const bars = computeGroupedBars(band.innerX, band.innerWidth, ctx.series.length, BAR_INNER_GAP);
  return svg`${ctx.series.map((s, si) => {
    const bar = bars[si]!;
    const value = g.values[s.key] ?? 0;
    const h = yMax > 0 ? (value / yMax) * innerHeight : 0;
    const drawH = value > 0 ? Math.max(MIN_SEGMENT_HEIGHT, h) : 0;
    const y = innerHeight - drawH;
    return svg`<rect class="bar" x=${bar.x} y=${y} width=${bar.width} height=${drawH} fill=${ctx.seriesColor(s, si)}></rect>`;
  })}`;
}

function renderFocusRing<T extends BarChartRow>(
  ctx: ChartRenderContext,
  layout: ChartLayout<T>,
): SVGTemplateResult | typeof nothing {
  if (ctx.activeIndex == null || ctx.focusMode !== 'keyboard') {
    return nothing;
  }
  const band = layout.bands[ctx.activeIndex];
  if (!band) {
    return nothing;
  }
  const maxHeight = activeGroupHeight(layout, ctx.activeIndex, ctx.stacked);
  const drawHeight = Math.max(4, maxHeight);
  const y = layout.innerHeight - drawHeight - 2;
  return svg`<rect class="focus-ring" x=${band.innerX - 2} y=${y} width=${band.innerWidth + 4} height=${drawHeight + 4} rx="4"></rect>`;
}
