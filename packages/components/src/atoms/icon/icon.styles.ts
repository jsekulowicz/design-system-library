import { css } from 'lit';

export const iconStyles = css`
  :host {
    display: inline-flex;
    width: 1em;
    height: 1em;
    color: currentColor;
    vertical-align: middle;
    flex-shrink: 0;
  }
  :host([size='sm']) {
    width: 0.875em;
    height: 0.875em;
  }
  :host([size='lg']) {
    width: 1.25em;
    height: 1.25em;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
    fill: currentColor;
    stroke: currentColor;
  }
`;
