import { css } from 'lit';

export const scrollablePageStyles = css`
  :host {
    display: flex;
    flex: 1 1 auto;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
  }

  .header {
    flex: none;
  }

  .header[hidden] {
    display: none;
  }

  .header-inner,
  .content {
    box-sizing: border-box;
    width: 100%;
    max-width: var(--ds-scrollable-page-max-width, none);
    padding-inline: var(--ds-scrollable-page-padding-inline, var(--ds-space-5));
  }

  .header-inner {
    padding-block-start: var(--ds-scrollable-page-padding-block, var(--ds-space-5));
  }

  .scroller {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: clip;
    overflow-y: auto;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
  }

  .content {
    display: flex;
    flex-direction: column;
    gap: var(--ds-scrollable-page-content-gap, var(--ds-space-6));
    padding-block: var(--ds-scrollable-page-header-gap, var(--ds-space-6))
      var(--ds-scrollable-page-padding-block, var(--ds-space-5));
  }

  :host([header-empty]) .content {
    padding-block-start: var(--ds-scrollable-page-padding-block, var(--ds-space-5));
  }

  slot:not([name]) {
    display: contents;
  }
`;
