export function emit(target, name, options) {
    const event = new CustomEvent(name, {
        detail: options.detail,
        bubbles: options.bubbles ?? true,
        composed: options.composed ?? true,
        cancelable: options.cancelable ?? false,
    });
    return target.dispatchEvent(event);
}
//# sourceMappingURL=event.js.map