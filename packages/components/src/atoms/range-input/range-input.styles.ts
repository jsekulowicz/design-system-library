import { css } from 'lit';

export const rangeInputStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    width: 100%;
    --ds-range-track-height: 0.375rem;
    --ds-range-thumb-size: 1.125rem;
  }
  :host([size='sm']) {
    --ds-range-track-height: 0.25rem;
    --ds-range-thumb-size: 0.875rem;
  }
  :host([size='lg']) {
    --ds-range-track-height: 0.5rem;
    --ds-range-thumb-size: 1.375rem;
  }
  .wrap {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
  }
  .range {
    flex: 1;
    min-width: 0;
    height: var(--ds-range-thumb-size);
    margin: 0;
    background: transparent;
    cursor: pointer;
    -webkit-appearance: none;
    appearance: none;
  }
  /* Track — filled portion (accent) up to the thumb, rest is subtle. */
  .range::-webkit-slider-runnable-track {
    height: var(--ds-range-track-height);
    border-radius: var(--ds-radius-full);
    background: linear-gradient(
      to right,
      var(--ds-color-accent) var(--ds-range-fill, 0%),
      var(--ds-color-bg-subtle) var(--ds-range-fill, 0%)
    );
  }
  .range::-moz-range-track {
    height: var(--ds-range-track-height);
    border-radius: var(--ds-radius-full);
    background: var(--ds-color-bg-subtle);
  }
  .range::-moz-range-progress {
    height: var(--ds-range-track-height);
    border-radius: var(--ds-radius-full);
    background: var(--ds-color-accent);
  }
  /* Thumb */
  .range::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: var(--ds-range-thumb-size);
    height: var(--ds-range-thumb-size);
    margin-top: calc((var(--ds-range-track-height) - var(--ds-range-thumb-size)) / 2);
    border-radius: var(--ds-radius-full);
    border: 2px solid var(--ds-color-accent);
    background: var(--ds-color-bg);
    box-shadow: var(--ds-shadow-sm);
    transition: box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .range::-moz-range-thumb {
    width: var(--ds-range-thumb-size);
    height: var(--ds-range-thumb-size);
    border-radius: var(--ds-radius-full);
    border: 2px solid var(--ds-color-accent);
    background: var(--ds-color-bg);
    box-shadow: var(--ds-shadow-sm);
    transition: box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .range:focus-visible {
    outline: none;
  }
  .range:focus-visible::-webkit-slider-thumb {
    box-shadow: var(--ds-shadow-focus);
  }
  .range:focus-visible::-moz-range-thumb {
    box-shadow: var(--ds-shadow-focus);
  }
  /* Invalid */
  :host([invalid]) .range::-webkit-slider-runnable-track {
    background: linear-gradient(
      to right,
      var(--ds-color-danger) var(--ds-range-fill, 0%),
      var(--ds-color-bg-subtle) var(--ds-range-fill, 0%)
    );
  }
  :host([invalid]) .range::-moz-range-progress {
    background: var(--ds-color-danger);
  }
  :host([invalid]) .range::-webkit-slider-thumb {
    border-color: var(--ds-color-danger);
  }
  :host([invalid]) .range::-moz-range-thumb {
    border-color: var(--ds-color-danger);
  }
  /* Disabled */
  :host([disabled]) {
    opacity: 0.5;
  }
  :host([disabled]) .range {
    cursor: not-allowed;
  }
  output {
    min-width: 2.5ch;
    text-align: right;
    color: var(--ds-color-fg);
    font-size: var(--ds-font-size-body-lg);
    font-variant-numeric: tabular-nums;
  }
`;
