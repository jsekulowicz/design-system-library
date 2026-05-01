type UpdatableElement = Element & { updateComplete?: Promise<unknown> };

function hasUpdateComplete(element: Element): element is UpdatableElement {
  return 'updateComplete' in element;
}

async function awaitUpdate(element: Element): Promise<void> {
  if (hasUpdateComplete(element) && element.updateComplete) {
    await element.updateComplete;
  }
}

export function resetTestDom(): void {
  document.body.innerHTML = '';
}

export async function mount<T extends Element>(template: string, selector?: string): Promise<T> {
  document.body.innerHTML = template.trim();
  const element = selector ? document.body.querySelector(selector) : document.body.firstElementChild;
  if (!(element instanceof Element)) {
    throw new Error(`No element found while mounting template${selector ? ` for selector "${selector}"` : ''}.`);
  }
  await awaitUpdate(element);
  return element as T;
}

export async function mountWithProps<T extends Element>(
  template: string,
  props: Partial<T> = {},
  selector?: string,
): Promise<T> {
  const element = await mount<T>(template, selector);
  Object.assign(element, props);
  await awaitUpdate(element);
  return element;
}
