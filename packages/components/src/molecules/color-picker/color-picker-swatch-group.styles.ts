import { css } from 'lit';

export const colorPickerSwatchGroupStyles = css`
  :host {
    display: grid;
    gap: var(--ds-space-2);
  }

  .section-label {
    color: var(--ds-color-fg);
    font-size: var(--ds-font-size-xs);
    font-weight: var(--ds-font-weight-medium);
  }

  .swatches {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
    gap: var(--ds-space-2);
  }
`;
