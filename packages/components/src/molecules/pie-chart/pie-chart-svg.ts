import { html, svg, nothing, type TemplateResult, type SVGTemplateResult } from 'lit';
import { chartTitleId, datumId, rovingTabIndex } from '../../shared/chart-a11y.js';
import {
  RADIUS,
  VIEWBOX_SIZE,
  arcPath,
  innerRadiusFor,
  labelPlacement,
} from './pie-geometry.js';
import { sliceAriaLabel } from './pie-chart-overlays.js';
import type { PieRenderContext, PieSlice } from './types.js';

const FOCUS_RING_OFFSET = 2.5;

export function renderPieSvg(ctx: PieRenderContext, slices: readonly PieSlice[]): TemplateResult {
  const inner = innerRadiusFor(ctx.donut, ctx.innerRadius);
  return html`
    <svg
      viewBox="0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}"
      role="graphics-document"
      aria-roledescription="pie chart"
      aria-labelledby=${chartTitleId(ctx.uid)}
    >
      ${slices.map((slice, index) => renderSlice(ctx, slice, index, inner))}
      ${renderFocusRing(ctx, slices, inner)}
    </svg>
  `;
}

function hasSweep(slice: PieSlice): boolean {
  return slice.endAngle > slice.startAngle;
}

function renderSlice(
  ctx: PieRenderContext,
  slice: PieSlice,
  index: number,
  inner: number,
): SVGTemplateResult {
  const inactive = ctx.activeIndex != null && ctx.activeIndex !== index ? 'inactive' : '';
  return svg`
    <g
      class="slice ${inactive}"
      part="slice"
      id=${datumId(ctx.uid, 'slice', index)}
      data-index=${index}
      role="graphics-symbol"
      tabindex=${rovingTabIndex(index, ctx.activeIndex)}
      aria-label=${sliceAriaLabel(ctx, slice)}
    >
      ${hasSweep(slice)
        ? svg`<path class="slice-shape" d=${arcPath(slice, RADIUS, inner)} fill=${ctx.sliceColor(slice, index)}></path>`
        : nothing}
      ${renderSliceLabel(ctx, slice, index)}
    </g>
  `;
}

function renderSliceLabel(
  ctx: PieRenderContext,
  slice: PieSlice,
  index: number,
): SVGTemplateResult | typeof nothing {
  if (!ctx.showPercentages || ctx.activeIndex === index) {
    return nothing;
  }
  const placement = labelPlacement(slice, RADIUS);
  if (placement.kind === 'none') {
    return nothing;
  }
  const text = ctx.formatPercent(slice.percent);
  const gap = placement.anchorEnd === 'end' ? -1.5 : 1.5;
  return svg`
    <line
      class="leader-line"
      aria-hidden="true"
      x1=${placement.anchor.x}
      y1=${placement.anchor.y}
      x2=${placement.point.x}
      y2=${placement.point.y}
    ></line>
    <text
      class="slice-label"
      aria-hidden="true"
      x=${placement.point.x + gap}
      y=${placement.point.y}
      text-anchor=${placement.anchorEnd}
      dominant-baseline="middle"
    >${text}</text>
  `;
}

function renderFocusRing(
  ctx: PieRenderContext,
  slices: readonly PieSlice[],
  inner: number,
): SVGTemplateResult | typeof nothing {
  if (ctx.activeIndex == null || ctx.focusMode !== 'keyboard') {
    return nothing;
  }
  const slice = slices[ctx.activeIndex];
  if (!slice || !hasSweep(slice)) {
    return nothing;
  }
  const outerRing = RADIUS + FOCUS_RING_OFFSET;
  const innerRing = inner > 0 ? Math.max(0, inner - FOCUS_RING_OFFSET) : 0;
  return svg`<path class="focus-ring" d=${arcPath(slice, outerRing, innerRing)}></path>`;
}
