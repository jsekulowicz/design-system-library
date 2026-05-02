import { getNextTileFocusIndex, getVisibleTileCount } from './select.shared.js';
import type { DropdownController } from './dropdown-controller.js';
import type { SelectOption } from './select.js';

export interface KeydownContext {
  controller: DropdownController;
  multiple: boolean;
  options: SelectOption[];
  values: string[];
  selectOption: (option: SelectOption) => void;
  tileArrowLeftGate?: () => boolean;
}

export function dropdownKeydown(event: KeyboardEvent, ctx: KeydownContext): 'handled' | 'pass' {
  const { controller } = ctx;
  const visibleCount = getVisibleTileCount(ctx.values.length, controller.overflowCount);

  if (ctx.multiple && visibleCount > 0) {
    if (event.key === 'ArrowLeft' && (ctx.tileArrowLeftGate ? ctx.tileArrowLeftGate() : true)) {
      event.preventDefault();
      controller.focusedTileIndex = getNextTileFocusIndex(
        controller.focusedTileIndex,
        visibleCount,
        'left',
      );
      return 'handled';
    }
    if (event.key === 'ArrowRight' && controller.focusedTileIndex >= 0) {
      event.preventDefault();
      controller.focusedTileIndex = getNextTileFocusIndex(
        controller.focusedTileIndex,
        visibleCount,
        'right',
      );
      return 'handled';
    }
    if ((event.key === ' ' || event.key === 'Backspace') && controller.focusedTileIndex >= 0) {
      event.preventDefault();
      const value = ctx.values[controller.focusedTileIndex];
      if (value !== undefined) controller.removeTile(value);
      return 'handled';
    }
  }

  if (event.key === 'Escape') {
    controller.close();
    return 'handled';
  }

  if (!controller.open) {
    return 'pass';
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    controller.moveFocus(1);
    return 'handled';
  }
  if (event.key === 'ArrowUp') {
    event.preventDefault();
    controller.moveFocus(-1);
    return 'handled';
  }
  if (event.key === 'Enter' && controller.focusedIndex >= 0) {
    const focused = ctx.options[controller.focusedIndex];
    if (focused?.disabled) {
      event.preventDefault();
    } else if (focused) {
      ctx.selectOption(focused);
    }
    return 'handled';
  }
  return 'pass';
}

export function clearKeydown(event: KeyboardEvent, clear: () => void): void {
  if (event.key === 'Enter' || event.key === ' ') {
    event.stopPropagation();
    event.preventDefault();
    clear();
  }
}
