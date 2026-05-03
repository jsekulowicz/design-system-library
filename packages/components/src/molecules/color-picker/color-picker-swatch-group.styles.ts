import { css } from 'lit';

export const colorPickerSwatchGroupStyles = css`
  :host {
    --color-picker-swatch-size: 28px;

    display: grid;
    gap: var(--ds-space-2);
  }
  :host([compact]) {
    --color-picker-swatch-size: 24px;
  }

  .section-label {
    color: var(--ds-color-fg);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
  }

  .swatches {
    display: grid;
    grid-template-columns: repeat(
      auto-fill,
      minmax(var(--color-picker-swatch-size), var(--color-picker-swatch-size))
    );
    gap: var(--ds-space-1);
  }
`;
