import { css } from 'lit';

export const iconStyles = css`
  :host {
    display: inline-flex;
    width: 1.125rem;
    height: 1.125rem;
    color: currentColor;
    vertical-align: middle;
    flex-shrink: 0;
  }
  :host([size='sm']) {
    width: 0.875rem;
    height: 0.875rem;
  }
  :host([size='md']) {
    width: 1rem;
    height: 1rem;
  }
  :host([size='lg']) {
    width: 1.125rem;
    height: 1.125rem;
  }
  :host([size='xl']) {
    width: 1.25rem;
    height: 1.25rem;
  }
  :host([size='2xl']) {
    width: 1.5rem;
    height: 1.5rem;
  }
  :host([size='3xl']) {
    width: 1.75rem;
    height: 1.75rem;
  }
  :host([size='4xl']) {
    width: 1.875rem;
    height: 1.875rem;
  }
  svg {
    width: 100%;
    height: 100%;
    display: block;
  }
`;
