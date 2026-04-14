export interface DsEventOptions<T> {
    detail: T;
    bubbles?: boolean;
    composed?: boolean;
    cancelable?: boolean;
}
export declare function emit<T>(target: EventTarget, name: string, options: DsEventOptions<T>): boolean;
//# sourceMappingURL=event.d.ts.map