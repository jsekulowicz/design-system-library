import { css } from 'lit';

export const navGroupStyles = css`
  :host {
    display: block;
  }
  :host([compact]) {
    .heading {
      height: var(--ds-sidenav-item-compact-size);
      width: var(--ds-sidenav-item-compact-size);
    }
  }
  .heading {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    width: 100%;
    height: var(--ds-sidenav-item-height);
    padding: var(--ds-space-2) var(--ds-space-3);
    border: none;
    background: transparent;
    border-radius: var(--ds-radius-sm);
    color: var(--ds-color-fg-subtle);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-2xs);
    font-weight: var(--ds-font-weight-semibold);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
    text-align: left;
    cursor: pointer;
  }
  .heading[disabled] {
    cursor: default;
  }
  .heading:hover:not([disabled]) {
    color: var(--ds-color-fg);
  }
  .heading:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }
  .icon {
    display: inline-flex;
    flex: none;
  }
  .icon[hidden] {
    display: none;
  }
  .label {
    flex: 1;
    overflow: hidden;
    white-space: nowrap;
  }
  .chevron {
    display: inline-flex;
    flex: none;
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .chevron svg {
    width: 1rem;
    height: 1rem;
  }
  :host([expanded]) .chevron {
    transform: rotate(180deg);
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    padding-left: var(--ds-space-2);
  }
  .items[hidden] {
    display: none;
  }
  :host([compact]) .label {
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
  }
  :host([compact]) .heading {
    justify-content: center;
    gap: var(--ds-space-1);
    padding: var(--ds-space-2);
  }
  :host([compact]) .chevron svg {
    width: 0.75rem;
    height: 0.75rem;
  }
  :host([compact]) .items {
    padding-left: 0;
  }
  .tooltip-wrapper {
    display: block;
    width: 100%;
  }
  .tooltip-wrapper::part(anchor) {
    display: block;
    width: 100%;
  }
`;
