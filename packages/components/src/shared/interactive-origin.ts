const INTERACTIVE_TAGS = new Set([
  'a',
  'button',
  'input',
  'select',
  'textarea',
  'label',
  'ds-button',
  'ds-link',
  'ds-checkbox',
  'ds-radio',
  'ds-select',
  'ds-searchable-select',
  'ds-text-field',
  'ds-table-sort-button',
  'ds-table-pagination',
]);

const INTERACTIVE_ROLES = new Set([
  'button',
  'checkbox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'textbox',
]);

export function isInteractiveElement(node: Element): boolean {
  if (INTERACTIVE_TAGS.has(node.tagName.toLowerCase())) {
    return true;
  }
  const role = node.getAttribute('role');
  return role !== null && INTERACTIVE_ROLES.has(role);
}

export function hasInteractiveSlottedOrigin(event: Event, root: Node): boolean {
  for (const node of event.composedPath()) {
    if (!(node instanceof Element)) {
      continue;
    }
    if (node.getRootNode() === root) {
      return false;
    }
    if (isInteractiveElement(node)) {
      return true;
    }
  }
  return false;
}
