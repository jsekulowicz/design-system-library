interface ModalDialogPrototype {
  showModal?: () => void;
  close?: (returnValue?: string) => void;
}

export function stubAriaReflection(prototype: object): void {
  const methods = prototype as Record<string, () => void>;
  methods['setAriaLabel'] = () => {};
  methods['setAriaDescription'] = () => {};
}

export function shimModalDialogMethods(): void {
  const proto = HTMLDialogElement.prototype as unknown as ModalDialogPrototype;
  if (typeof proto.showModal !== 'function') {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.setAttribute('open', '');
    };
  }
  if (typeof proto.close !== 'function') {
    proto.close = function close(this: HTMLDialogElement, returnValue?: string) {
      if (returnValue !== undefined) {
        (this as unknown as { returnValue: string }).returnValue = returnValue;
      }
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  }
}
