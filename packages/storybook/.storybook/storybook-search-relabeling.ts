import { getSearchLabel, setFriendlyDocsLabelsEnabled } from './storybook-search-labels';

const SEARCH_RESULT_SELECTOR = '[role="option"]';
const RELABELED_ATTR = 'data-ds-docs-relabeled';
const LABEL_CELL_ATTR = 'data-ds-docs-label-cell';
const LABEL_WRAPPER_ATTR = 'data-ds-docs-label-wrapper';
const LABEL_ATTR = 'data-ds-docs-label';
const STYLE_ID = 'ds-storybook-docs-search-label-style';

let searchTextInputPending = false;

function ensureDocsRelabelStyles(): void {
  if (document.getElementById(STYLE_ID)) {
    return;
  }

  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    [${RELABELED_ATTR}="true"] [${LABEL_WRAPPER_ATTR}="true"] {
      justify-content: center !important;
    }

    [${RELABELED_ATTR}="true"] [${LABEL_CELL_ATTR}="true"] {
      font-size: 0 !important;
      line-height: 0 !important;
    }

    [${RELABELED_ATTR}="true"] [${LABEL_CELL_ATTR}="true"]::after {
      color: var(--ds-docs-label-color, currentColor);
      content: attr(${LABEL_ATTR});
      display: block;
      font-size: var(--ds-docs-label-font-size, 14px);
      letter-spacing: var(--ds-docs-label-letter-spacing, normal);
      line-height: var(--ds-docs-label-line-height, normal);
      white-space: nowrap;
    }

    [${RELABELED_ATTR}="true"] [${LABEL_CELL_ATTR}="true"] + * {
      display: none !important;
    }
  `;
  document.head.append(style);
}

function getSearchInput(scope: ParentNode = document): HTMLInputElement | null {
  return scope.querySelector<HTMLInputElement>('input[type="search"], input[role="searchbox"]');
}

function clearRecentDocsRelabeling(scope: ParentNode = document): void {
  const relabeledItems = scope.querySelectorAll<HTMLElement>(`[${RELABELED_ATTR}="true"]`);
  for (const item of relabeledItems) {
    const labelCell = item.querySelector<HTMLElement>(`[${LABEL_CELL_ATTR}="true"]`);
    if (labelCell) {
      labelCell.parentElement?.removeAttribute(LABEL_WRAPPER_ATTR);
      labelCell.removeAttribute(LABEL_CELL_ATTR);
      labelCell.removeAttribute(LABEL_ATTR);
      labelCell.style.removeProperty('--ds-docs-label-color');
      labelCell.style.removeProperty('--ds-docs-label-font-size');
      labelCell.style.removeProperty('--ds-docs-label-line-height');
      labelCell.style.removeProperty('--ds-docs-label-letter-spacing');
    }
    item.removeAttribute(RELABELED_ATTR);
  }
}

function relabelRecentDocs(scope: ParentNode = document): void {
  const input = getSearchInput(scope);
  const shouldUseFriendlyLabels = !searchTextInputPending && !input?.value.trim();
  setFriendlyDocsLabelsEnabled(shouldUseFriendlyLabels);
  if (!shouldUseFriendlyLabels) {
    clearRecentDocsRelabeling(scope);
    return;
  }

  for (const item of scope.querySelectorAll<HTMLElement>(SEARCH_RESULT_SELECTOR)) {
    if (item.getAttribute(RELABELED_ATTR) === 'true') {
      continue;
    }
    const result = getSearchLabel(item);
    if (!result?.label) {
      continue;
    }
    const styles = window.getComputedStyle(result.cell);
    ensureDocsRelabelStyles();
    result.cell.style.setProperty('--ds-docs-label-color', styles.color);
    result.cell.style.setProperty('--ds-docs-label-font-size', styles.fontSize);
    result.cell.style.setProperty('--ds-docs-label-line-height', styles.lineHeight);
    result.cell.style.setProperty('--ds-docs-label-letter-spacing', styles.letterSpacing);
    result.cell.setAttribute(LABEL_ATTR, result.label);
    result.cell.setAttribute(LABEL_CELL_ATTR, 'true');
    result.cell.parentElement?.setAttribute(LABEL_WRAPPER_ATTR, 'true');
    item.setAttribute(RELABELED_ATTR, 'true');
  }
}

function isSearchTextInput(event: KeyboardEvent): boolean {
  if (!(event.target instanceof HTMLInputElement)) {
    return false;
  }
  return (event.target.type === 'search' || event.target.getAttribute('role') === 'searchbox') && event.key.length === 1;
}

export function setupRecentDocsRelabeling(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return;
  }
  let scheduled = false;
  let observing = false;
  function schedule(): void {
    if (scheduled) {
      return;
    }
    scheduled = true;
    window.requestAnimationFrame(() => {
      scheduled = false;
      relabelRecentDocs(document);
    });
  }
  function scheduleDelayed(): void {
    schedule();
    window.setTimeout(schedule, 50);
    window.setTimeout(schedule, 150);
  }
  function observeBody(): void {
    if (observing || !document.body) {
      return;
    }
    observing = true;
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true });
    schedule();
  }

  document.addEventListener(
    'keydown',
    (event) => {
      if (isSearchTextInput(event)) {
        searchTextInputPending = true;
        setFriendlyDocsLabelsEnabled(false);
        clearRecentDocsRelabeling(document);
      }
    },
    true,
  );
  document.addEventListener('focusin', scheduleDelayed);
  document.addEventListener('input', () => {
    searchTextInputPending = false;
    schedule();
  });
  window.setInterval(() => {
    const input = getSearchInput(document);
    if (input === document.activeElement) {
      relabelRecentDocs(document);
    }
  }, 250);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeBody, { once: true });
  } else {
    observeBody();
  }
}
