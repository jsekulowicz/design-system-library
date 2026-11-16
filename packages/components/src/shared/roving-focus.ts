export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface RovingTargetOptions {
  key: string;
  currentIndex: number;
  count: number;
  orientation?: RovingOrientation;
  isDisabled?: (index: number) => boolean;
}

function wrapIndex(value: number, count: number): number {
  return ((value % count) + count) % count;
}

export function resolveRovingTarget({
  key,
  currentIndex,
  count,
  orientation = 'both',
  isDisabled = () => false,
}: RovingTargetOptions): number | null {
  if (count === 0) {
    return null;
  }
  const horizontal = orientation === 'horizontal' || orientation === 'both';
  const vertical = orientation === 'vertical' || orientation === 'both';
  const forward = (horizontal && key === 'ArrowRight') || (vertical && key === 'ArrowDown');
  const backward = (horizontal && key === 'ArrowLeft') || (vertical && key === 'ArrowUp');

  let from = currentIndex;
  let step: number;
  if (forward) {
    step = 1;
  } else if (backward) {
    step = -1;
  } else if (key === 'Home') {
    from = -1;
    step = 1;
  } else if (key === 'End') {
    from = count;
    step = -1;
  } else {
    return null;
  }

  let index = from;
  for (let i = 0; i < count; i += 1) {
    index = wrapIndex(index + step, count);
    if (!isDisabled(index)) {
      return index;
    }
  }
  return null;
}
