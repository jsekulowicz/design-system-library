/* A modal <dialog> only leaves the top layer when it is closed or removed from
   the document. Hiding an ancestor is not enough: the dialog keeps blocking the
   rest of the page, which then reads as a frozen UI with no way back short of a
   reload. Overlays close their nested dialogs on the way out so no composition
   can strand one. */
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
