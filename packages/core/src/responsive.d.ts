import type { ReactiveController, ReactiveControllerHost } from 'lit';
export type BreakpointName = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export declare class ContainerSizeController implements ReactiveController {
    #private;
    size: BreakpointName;
    constructor(host: ReactiveControllerHost & HTMLElement);
    hostConnected(): void;
    hostDisconnected(): void;
}
//# sourceMappingURL=responsive.d.ts.map