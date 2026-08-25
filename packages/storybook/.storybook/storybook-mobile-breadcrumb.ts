const MOBILE_NAVIGATION_LABEL_SELECTOR = 'button[aria-label="Open navigation menu"] p';

export function getCompactStoryPath(value: string): string {
  const segments = value
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
  if (segments.length > 1 && segments.at(-1) === segments.at(-2)) {
    segments.pop();
  }
  return segments.join('/');
}

function normalizeMobileBreadcrumb(scope: ParentNode): void {
  const label = scope.querySelector<HTMLElement>(MOBILE_NAVIGATION_LABEL_SELECTOR);
  if (!label) {
    return;
  }
  const compactPath = getCompactStoryPath(label.textContent ?? '');
  if (compactPath && compactPath !== label.textContent) {
    label.textContent = compactPath;
  }
}

export function setupMobileBreadcrumb(): void {
  function observeBody(): void {
    if (!document.body) {
      return;
    }
    let normalizationScheduled = false;
    function scheduleNormalization(): void {
      if (normalizationScheduled) {
        return;
      }
      normalizationScheduled = true;
      requestAnimationFrame(() => {
        normalizationScheduled = false;
        normalizeMobileBreadcrumb(document);
      });
    }

    const observer = new MutationObserver(scheduleNormalization);
    observer.observe(document.body, { characterData: true, childList: true, subtree: true });
    scheduleNormalization();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeBody, { once: true });
    return;
  }
  observeBody();
}
