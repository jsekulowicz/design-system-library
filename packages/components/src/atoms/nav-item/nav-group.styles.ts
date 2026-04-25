import { css } from 'lit';

export const navGroupStyles = css`
  :host {
    display: block;
  }
  .heading {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    width: 100%;
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
  .icon:empty {
    display: none;
  }
  .label {
    flex: 1;
  }
  .chevron {
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
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
  :host-context(ds-sidenav[collapsed]) .label,
  :host-context(ds-sidenav[collapsed]) .chevron {
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    overflow: hidden;
    white-space: nowrap;
    position: absolute;
  }
  :host-context(ds-sidenav[collapsed]) .heading {
    justify-content: center;
    padding: var(--ds-space-2);
  }
  :host-context(ds-sidenav[collapsed]) .items {
    padding-left: 0;
  }
`;
