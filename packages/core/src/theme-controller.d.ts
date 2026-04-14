import type { ReactiveController, ReactiveControllerHost } from 'lit';
export type Theme = 'light' | 'dark' | 'auto';
export declare class ThemeController implements ReactiveController {
    #private;
    theme: Theme;
    constructor(host: ReactiveControllerHost);
    hostConnected(): void;
    hostDisconnected(): void;
}
//# sourceMappingURL=theme-controller.d.ts.map