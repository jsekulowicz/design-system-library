/* Hiding an ancestor does not remove a modal from the top layer; it keeps
   blocking the page until closed. */
export function closeNestedDialogs(root: ParentNode): void {
  for (const element of root.querySelectorAll('*')) {
    if (element instanceof HTMLDialogElement && element.open) {
      element.close();
    }
    const { shadowRoot } = element as Element & { shadowRoot?: ShadowRoot | null };
    if (shadowRoot) {
      closeNestedDialogs(shadowRoot);
    }
  }
}
