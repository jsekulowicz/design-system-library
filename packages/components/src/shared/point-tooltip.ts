import { html, type TemplateResult } from 'lit';

interface PopoverElement extends HTMLElement {
  showPopover(): void;
  hidePopover(): void;
}

function asPopoverElement(el: Element | null | undefined): PopoverElement | null {
  const candidate = el as Partial<PopoverElement> | null | undefined;
  return candidate && typeof candidate.showPopover === 'function' ? (candidate as PopoverElement) : null;
}

export type PointTooltipArea = 'top' | 'bottom' | 'top left' | 'top right' | 'bottom left' | 'bottom right';

export interface PointTooltipOptions {
  left: string;
  top: string;
  area: PointTooltipArea;
  open: boolean;
  content: TemplateResult;
}

/** Anchors one shared bubble to a data point, in the top layer so no ancestor can clip it. */
export function renderPointAnchor(left: string, top: string): TemplateResult {
  return html`<div class="point-anchor" style="left:${left}; top:${top}"></div>`;
}

export function renderPointTooltipBubble(options: Omit<PointTooltipOptions, 'left' | 'top'>): TemplateResult {
  return html`
    <div
      class="point-tooltip"
      part="tooltip"
      role="tooltip"
      aria-hidden="true"
      popover="manual"
      ?data-open=${options.open}
      style="--ds-point-tooltip-area:${options.area}"
    >
      ${options.content}
    </div>
  `;
}

export function renderPointTooltip(options: PointTooltipOptions): TemplateResult {
  return html`${renderPointAnchor(options.left, options.top)}${renderPointTooltipBubble(options)}`;
}

export function syncPointTooltip(root: ShadowRoot | null | undefined, show: boolean): void {
  const tooltip = asPopoverElement(root?.querySelector('.point-tooltip'));
  if (!tooltip) {
    return;
  }
  const open = tooltip.matches(':popover-open');
  if (show === open) {
    return;
  }
  try {
    if (show) {
      tooltip.showPopover();
    } else {
      tooltip.hidePopover();
    }
  } catch (error) {
    void error;
  }
}
