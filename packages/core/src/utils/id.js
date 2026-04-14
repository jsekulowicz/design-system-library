let counter = 0;
export function nextId(prefix = 'ds') {
    counter += 1;
    return `${prefix}-${counter.toString(36)}`;
}
export function ensureId(element, prefix = 'ds') {
    if (!element.id) {
        element.id = nextId(prefix);
    }
    return element.id;
}
//# sourceMappingURL=id.js.map