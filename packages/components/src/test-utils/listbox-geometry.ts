export function stubListboxGeometry(listbox: HTMLElement, rowHeight: number, viewportHeight: number): void {
  Object.defineProperty(listbox, 'clientHeight', { configurable: true, value: viewportHeight });
  listbox.querySelectorAll<HTMLElement>('ds-select-option').forEach((option, index) => {
    Object.defineProperty(option, 'offsetTop', { configurable: true, value: index * rowHeight });
    Object.defineProperty(option, 'offsetHeight', { configurable: true, value: rowHeight });
  });
}
