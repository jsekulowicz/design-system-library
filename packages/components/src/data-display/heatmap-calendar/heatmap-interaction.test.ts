import { describe, expect, it } from 'vitest';
import { actionForKey } from './heatmap-interaction.js';

describe('actionForKey', () => {
  it('moves by days and weeks without leaving the visible range', () => {
    expect(actionForKey('ArrowDown', 4, 20)).toEqual({ index: 5 });
    expect(actionForKey('ArrowUp', 0, 20)).toEqual({ index: 0 });
    expect(actionForKey('ArrowRight', 4, 20)).toEqual({ index: 11 });
    expect(actionForKey('ArrowLeft', 4, 20)).toEqual({ index: 0 });
  });

  it('jumps to either end and leaves Escape and Tab to the page', () => {
    expect(actionForKey('Home', 5, 20)).toEqual({ index: 0 });
    expect(actionForKey('End', 5, 20)).toEqual({ index: 19 });
    expect(actionForKey('Escape', 5, 20)).toBeNull();
    expect(actionForKey('Tab', 5, 20)).toBeNull();
  });
});
