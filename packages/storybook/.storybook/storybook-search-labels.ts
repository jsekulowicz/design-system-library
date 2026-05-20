const STORYBOOK_CATEGORIES = ['Foundations', 'Atoms', 'Molecules', 'Organisms', 'Templates', 'Pages'] as const;
let shouldUseFriendlyDocsLabels = true;

type StorybookLabelItem = {
  id?: string;
  name?: string;
};

type StorybookLabelApi = {
  getData: (id: string) => { title?: string } | undefined;
};

export type SearchLabelResult = {
  cell: HTMLElement;
  label: string;
};

export function setFriendlyDocsLabelsEnabled(enabled: boolean): void {
  shouldUseFriendlyDocsLabels = enabled;
}

function getLastPathSegment(value: string): string {
  const segments = value
    .split('/')
    .map((segment) => segment.trim())
    .filter(Boolean);
  return segments.at(-1) ?? value.trim();
}

function getStoryTitle(api: StorybookLabelApi, id: string): string | undefined {
  try {
    return api.getData(id)?.title;
  } catch {
    return undefined;
  }
}

function getCategorylessLabel(value: string): string {
  const category = STORYBOOK_CATEGORIES.find((item) => value.startsWith(item) && value.length > item.length);
  return category ? value.slice(category.length) : value;
}

function getLeafTextElements(item: HTMLElement): HTMLElement[] {
  return Array.from(item.querySelectorAll<HTMLElement>('*')).filter((element) => {
    const text = element.textContent?.trim();
    return element.childElementCount === 0 && text !== undefined && text.length > 0;
  });
}

function getSearchPathLabel(leafElements: HTMLElement[], labelCell: HTMLElement): string {
  return leafElements
    .slice(leafElements.indexOf(labelCell) + 1)
    .map((element) => element.textContent?.trim() ?? '')
    .filter(Boolean)
    .join('/')
    .replace(/\s*\/\s*/g, '/');
}

function getSearchIdLabel(item: HTMLElement): string {
  const id = item.dataset['id'] ?? '';
  const path = id.replace(/--docs$/, '').split('-').filter(Boolean);
  return path.at(-1) ?? '';
}

export function getSearchLabel(item: HTMLElement): SearchLabelResult | null {
  const leafElements = getLeafTextElements(item);
  for (const cell of leafElements) {
    const text = cell.textContent?.trim() ?? '';
    if (text.endsWith(' Docs')) {
      const label = text.slice(0, -' Docs'.length).trim();
      return { cell, label: getCategorylessLabel(label) };
    }
    if (text === 'Docs') {
      const pathLabel = getLastPathSegment(getSearchPathLabel(leafElements, cell));
      return { cell, label: pathLabel || getSearchIdLabel(item) };
    }
    const categorylessLabel = getCategorylessLabel(text);
    if (categorylessLabel !== text) {
      return { cell, label: categorylessLabel };
    }
  }
  return null;
}

export function getFriendlyDocsLabel(item: StorybookLabelItem, api: StorybookLabelApi): string {
  const name = item.name ?? '';
  if (!shouldUseFriendlyDocsLabels) {
    return name;
  }
  const title = item.id ? getStoryTitle(api, item.id) : undefined;
  if (!title) {
    return getCategorylessLabel(name);
  }
  return getLastPathSegment(title);
}
