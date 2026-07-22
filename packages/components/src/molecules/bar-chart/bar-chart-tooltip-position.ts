const TOOLTIP_EDGE_GAP = 8;

export type TooltipPosition = 'above' | 'below' | 'contained';

export function tooltipPosition(
  anchorTop: number,
  tooltipHeight: number,
  frameHeight: number,
): TooltipPosition {
  if (anchorTop - TOOLTIP_EDGE_GAP - tooltipHeight >= TOOLTIP_EDGE_GAP) {
    return 'above';
  }
  if (anchorTop + TOOLTIP_EDGE_GAP + tooltipHeight <= frameHeight - TOOLTIP_EDGE_GAP) {
    return 'below';
  }
  return 'contained';
}

export function positionTooltip(frame: HTMLElement): void {
  const tooltip = frame.querySelector<HTMLElement>('.tooltip:not([hidden])');
  if (!tooltip) {
    return;
  }
  const anchorTop = Number(tooltip.dataset['anchorTop']);
  const position = tooltipPosition(anchorTop, tooltip.offsetHeight, frame.clientHeight);
  tooltip.dataset['position'] = position;
  if (position === 'contained') {
    const availableTop = frame.clientHeight - tooltip.offsetHeight - TOOLTIP_EDGE_GAP;
    const maxTop = Math.max(TOOLTIP_EDGE_GAP, availableTop);
    tooltip.style.top = `${Math.min(Math.max(TOOLTIP_EDGE_GAP, anchorTop), maxTop)}px`;
  }
}
