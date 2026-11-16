import { describe, expect, it } from 'vitest';
import { getActionForKey } from './heatmap-interaction.js';

describe('getActionForKey', () => {
  it('moves by days and weeks without leaving the visible range', () => {
    expect(getActionForKey('ArrowDown', 4, 20)).toEqual({ index: 5 });
    expect(getActionForKey('ArrowUp', 0, 20)).toEqual({ index: 0 });
    expect(getActionForKey('ArrowRight', 4, 20)).toEqual({ index: 11 });
    expect(getActionForKey('ArrowLeft', 4, 20)).toEqual({ index: 0 });
  });

  it('jumps to either end and leaves Escape and Tab to the page', () => {
    expect(getActionForKey('Home', 5, 20)).toEqual({ index: 0 });
    expect(getActionForKey('End', 5, 20)).toEqual({ index: 19 });
    expect(getActionForKey('Escape', 5, 20)).toBeNull();
    expect(getActionForKey('Tab', 5, 20)).toBeNull();
  });
});
