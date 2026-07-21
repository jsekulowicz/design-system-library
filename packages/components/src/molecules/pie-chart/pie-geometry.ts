import type { PieSlice } from './types.js';

export const VIEWBOX_SIZE = 100;
export const CENTER = VIEWBOX_SIZE / 2;
export const RADIUS = 33;
export const LABEL_RADIUS = RADIUS + 6;
const FULL_CIRCLE = Math.PI * 2;
const LABEL_MIN_PERCENT = 3;

export type Point = { x: number; y: number };

export type LabelPlacement =
  | { kind: 'none' }
  | { kind: 'outside'; point: Point; anchor: Point; anchorEnd: 'start' | 'end' };

export function polarPoint(radius: number, angle: number): Point {
  return {
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle),
  };
}

export function innerRadiusFor(donut: boolean, ratio: number): number {
  if (!donut) {
    return 0;
  }
  return RADIUS * Math.min(0.9, Math.max(0, ratio));
}

function ringPath(outer: number, inner: number): string {
  const top = -Math.PI / 2;
  const bottom = Math.PI / 2;
  const outerTop = polarPoint(outer, top);
  const outerBottom = polarPoint(outer, bottom);
  const circle = `M ${outerTop.x} ${outerTop.y} A ${outer} ${outer} 0 1 1 ${outerBottom.x} ${outerBottom.y} A ${outer} ${outer} 0 1 1 ${outerTop.x} ${outerTop.y} Z`;
  if (inner <= 0) {
    return circle;
  }
  const innerTop = polarPoint(inner, top);
  const innerBottom = polarPoint(inner, bottom);
  return `${circle} M ${innerTop.x} ${innerTop.y} A ${inner} ${inner} 0 1 0 ${innerBottom.x} ${innerBottom.y} A ${inner} ${inner} 0 1 0 ${innerTop.x} ${innerTop.y} Z`;
}

export function arcPath(slice: PieSlice, outer: number, inner: number): string {
  const sweep = slice.endAngle - slice.startAngle;
  if (sweep >= FULL_CIRCLE - 1e-6) {
    return ringPath(outer, inner);
  }
  const largeArc = sweep > Math.PI ? 1 : 0;
  const outerStart = polarPoint(outer, slice.startAngle);
  const outerEnd = polarPoint(outer, slice.endAngle);
  if (inner <= 0) {
    return `M ${CENTER} ${CENTER} L ${outerStart.x} ${outerStart.y} A ${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y} Z`;
  }
  const innerEnd = polarPoint(inner, slice.endAngle);
  const innerStart = polarPoint(inner, slice.startAngle);
  return [
    `M ${outerStart.x} ${outerStart.y}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
    `L ${innerEnd.x} ${innerEnd.y}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${innerStart.x} ${innerStart.y}`,
    'Z',
  ].join(' ');
}

export function midAngle(slice: PieSlice): number {
  return (slice.startAngle + slice.endAngle) / 2;
}

/* Labels always sit outside the arc: text over a slice fill cannot guarantee
   4.5:1 across the palette, the page background can. */
export function labelPlacement(slice: PieSlice, outer: number): LabelPlacement {
  const angle = midAngle(slice);
  if (slice.percent < LABEL_MIN_PERCENT) {
    return { kind: 'none' };
  }
  const point = polarPoint(LABEL_RADIUS, angle);
  return {
    kind: 'outside',
    point,
    anchor: polarPoint(outer, angle),
    anchorEnd: point.x < CENTER ? 'end' : 'start',
  };
}
