interface PopoverElement extends HTMLElement {
  showPopover(): void;
  hidePopover(): void;
}

function isPopoverElement(el: Element | null): el is PopoverElement {
  return !!el && typeof (el as Partial<PopoverElement>).showPopover === 'function';
}

function callIgnoringUnsupportedPopover(action: () => void): void {
  try {
    action();
  } catch {
    return;
  }
}

export function showTooltipPopover(el: Element | null): void {
  if (isPopoverElement(el) && !el.matches(':popover-open')) {
    callIgnoringUnsupportedPopover(() => el.showPopover());
  }
}

export function hideTooltipPopover(el: Element | null): void {
  if (isPopoverElement(el) && el.matches(':popover-open')) {
    callIgnoringUnsupportedPopover(() => el.hidePopover());
  }
}
