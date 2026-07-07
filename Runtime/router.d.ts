// Type definitions for Soft Router
export interface RouteParams {
    [key: string]: string;
}

export interface QueryParams {
    [key: string]: string | string[];
}

export interface NavigationOptions {
    replace?: boolean;
    state?: Record<string, any>;
}

export interface RouteMetadata {
    pattern: string;
    params: string[];
    paramTypes: Map<string, string>;
    regex: RegExp;
    component: any;
}

export class SoftRouter {
    constructor(runtime: any);
    setContainer(container: HTMLElement): void;
    register(pattern: string, component: any): void;
    navigate(route: string, params?: Record<string, any>, query?: Record<string, string | string[]>, options?: NavigationOptions): Promise<void>;
    replace(route: string, params?: Record<string, any>, query?: Record<string, string | string[]>, state?: Record<string, any>): Promise<void>;
    start(initialRoute?: string): Promise<void>;
    stop(): void;
    getCurrentRoute(): string;
    getParams(): RouteParams;
    getQuery(): QueryParams;
}
