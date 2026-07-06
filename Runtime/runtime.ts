// Soft Runtime - Framework
// All internals are hidden from application code
// Developer API: Soft.start("#app") only

import { ProxyFactory } from './core/proxy';

// ============================================================
// INTERNAL TYPES - Never exposed to application code
// ============================================================

interface ComponentMetadata {
    componentName: string;
    domInstructions: DOMInstruction[];
    eventInstructions: EventInstruction[];
    conditionalInstructions: ConditionalInstruction[];
    loopInstructions: LoopInstruction[];
    dependencyGraph: DependencyBinding[];
}

interface DOMInstruction {
    id: number;
    kind: string;
    tag: string;
    parent: number | null;
    attrs: { name: string; value?: string; dynamic?: boolean; expr?: string }[];
    text: string | null;
}

interface EventInstruction {
    nodeId: number;
    event: string;
    handler: string;
    args: string[];
}

interface ConditionalInstruction {
    nodeId: number;
    condition: string;
    placeholderId: number;
}

interface LoopInstruction {
    nodeId: number;
    item: string;
    index: string | null;
    collection: string;
    containerId: number;
}

interface DependencyBinding {
    source: string;
    target: number;
    operation: string;
}

interface ComponentInstance {
    id: string;
    element: HTMLElement;
    state: any;
    nodes: Map<number, Node>;
    metadata: ComponentMetadata | null;
    cleanup?: () => void;
}

interface PageRegistration {
    route: string;
    factory: () => any;
    metadata: ComponentMetadata;
    canonical?: boolean;
}

interface ServiceRegistration {
    name: string;
    factory: () => any;
}

interface ComponentRegistration {
    name: string;
    factory: () => any;
    metadata: ComponentMetadata;
}

interface ApplicationManifest {
    pages: PageRegistration[];
    services: ServiceRegistration[];
    components: ComponentRegistration[];
}

// ============================================================
// INTERNAL IMPLEMENTATION - Never exposed to application code
// ============================================================

class ServiceContainer {
    private services = new Map<string, any>();
    private factories = new Map<string, () => any>();

    register(name: string, factory: () => any): void {
        this.factories.set(name, factory);
    }

    resolve<T>(name: string): T {
        if (this.services.has(name)) {
            return this.services.get(name);
        }

        const factory = this.factories.get(name);
        if (factory) {
            const instance = factory();
            this.services.set(name, instance);
            return instance;
        }

        throw new Error(`Service not found: ${name}`);
    }
}

class Router {
    private pages = new Map<string, PageRegistration>();
    private currentPage: ComponentInstance | null = null;
    private container: HTMLElement | null = null;
    private runtime: SoftRuntime;
    private currentParams: Record<string, any> = {};
    private currentQuery: Record<string, string | string[]> = {};
    private currentState: Record<string, any> = {};
    private isStarted = false;

    constructor(runtime: SoftRuntime) {
        this.runtime = runtime;
    }

    register(page: PageRegistration): void {
        // Bug #8: Prevent duplicate route registration
        if (this.pages.has(page.route)) {
            console.warn(`Duplicate route registration: ${page.route}`);
            return;
        }
        
        // Bug #9: Validate route pattern
        if (!this.validateRoutePattern(page.route)) {
            throw new Error(`Invalid route pattern: ${page.route}`);
        }
        
        this.pages.set(page.route, page);
    }

    setContainer(container: HTMLElement): void {
        this.container = container;
    }

    async navigate(route: string, params: Record<string, any> = {}, query: Record<string, string | string[]> = {}, options: { replace?: boolean; state?: Record<string, any> } = {}): Promise<void> {
        // Bug #18: Container not found - throw error
        if (!this.container) {
            throw new Error('Router container not set. Call setContainer() before navigate().');
        }

        // Bug #6: Check if route matches before updating URL
        const match = this.matchRoute(route, params);
        if (!match) {
            console.error(`No route found for: ${route}`);
            return;
        }

        // Bug #7: Validate missing parameters
        if (!this.validateRequiredParameters(route, params)) {
            console.error(`Missing required parameters for route: ${route}`);
            return;
        }

        // Bug #5: Validate parameter types
        if (!this.validateParameterTypes(params, match.metadata)) {
            console.error(`Parameter type validation failed for route: ${route}`);
            return;
        }

        // Bug #4: Properly encode special characters
        const encodedRoute = this.encodeRoute(route, params);
        const queryString = this.buildQueryString(query);
        const fullPath = queryString ? `${encodedRoute}?${queryString}` : encodedRoute;

        // Bug #11: Store state
        this.currentState = options.state || {};

        // Bug #12: Support replace navigation
        if (options.replace) {
            window.history.replaceState({ routeState: this.currentState }, '', fullPath);
        } else {
            window.history.pushState({ routeState: this.currentState }, '', fullPath);
        }

        // Bug #1: Trigger navigation
        await this.handleNavigation(fullPath, true);
    }

    async replace(route: string, params: Record<string, any> = {}, query: Record<string, string | string[]> = {}, state: Record<string, any> = {}): Promise<void> {
        return this.navigate(route, params, query, { replace: true, state });
    }

    async start(initialRoute?: string): Promise<void> {
        // Bug #18: Container not found - throw error
        if (!this.container) {
            throw new Error('Router container not set. Call setContainer() before start().');
        }

        this.isStarted = true;

        // Bug #3: Routes lost on direct navigation - ensure routes are registered before handling navigation
        if (this.pages.size === 0) {
            console.warn('Router started with no routes registered. Make sure to register routes before calling start().');
        }

        window.addEventListener('popstate', (e: PopStateEvent) => {
            const state = e.state || {};
            // Bug #11: Restore state from history - check both e.state and window.history.state
            this.currentState = state.routeState || (window.history.state && window.history.state.routeState) || {};
            this.handleNavigation(window.location.pathname + window.location.search, false);
        });

        // Bug #3: Handle initial route on page load
        // Bug #11: Restore state from history on page reload
        const initialState = window.history.state || {};
        this.currentState = initialState.routeState || {};
        
        const routeToLoad = initialRoute || window.location.pathname + window.location.search;
        await this.handleNavigation(routeToLoad, false);
    }

    private async handleNavigation(fullPath: string, fromNavigate: boolean): Promise<void> {
        const [pathname, queryString] = fullPath.split('?');
        
        // Bug #15: Strip hash fragment
        const hashIndex = pathname.indexOf('#');
        const cleanPathname = hashIndex >= 0 ? pathname.substring(0, hashIndex) : pathname;

        // Bug #2: Parse query parameters
        this.currentQuery = this.parseQuery(queryString || '');

        const match = this.matchRoute(cleanPathname);
        if (!match) {
            console.error(`No route found for: ${cleanPathname}`);
            return;
        }

        // Bug #13: Alias route canonical redirect
        if (!match.canonical && fromNavigate) {
            // Find the canonical route for this page
            const canonicalRoute = this.findCanonicalRoute(match.page);
            if (canonicalRoute) {
                const canonicalPath = this.buildCanonicalPath(canonicalRoute, match.params);
                await this.navigate(canonicalPath, match.params, this.currentQuery, { replace: true });
                return;
            }
        }

        this.currentParams = match.params || {};

        // Destroy current page
        if (this.currentPage) {
            await this.destroyPage();
        }

        // Create new page instance
        const state = match.page.factory();
        this.currentPage = await this.runtime.mountComponent(
            `page_${match.page.metadata.componentName}`,
            this.container!,
            state,
            match.page.metadata
        );

        // Bug #1: Navigation triggers render through mountComponent
    }

    private matchRoute(path: string, params?: Record<string, any>): { page: PageRegistration; params: Record<string, any>; canonical: boolean; metadata: any } | null {
        // Try exact match first
        if (this.pages.has(path)) {
            const page = this.pages.get(path)!;
            return { page, params: {}, canonical: true, metadata: page.metadata };
        }

        // Try pattern matching
        for (const [route, page] of this.pages.entries()) {
            const match = this.matchPattern(route, path);
            if (match) {
                return { page, params: match, canonical: true, metadata: page.metadata };
            }
        }

        return null;
    }

    private matchPattern(pattern: string, path: string): Record<string, any> | null {
        const patternParts = pattern.split('/').filter(Boolean);
        
        // Bug #15: Strip hash fragment from path before splitting
        const hashIndex = path.indexOf('#');
        const cleanPath = hashIndex >= 0 ? path.substring(0, hashIndex) : path;
        const pathParts = cleanPath.split('/').filter(Boolean);

        if (patternParts.length !== pathParts.length) return null;

        const params: Record<string, any> = {};

        for (let i = 0; i < patternParts.length; i++) {
            const patternPart = patternParts[i];
            const pathPart = pathParts[i];

            if (patternPart.startsWith(':')) {
                const paramName = patternPart.substring(1);
                // Bug #4: Decode special characters
                params[paramName] = decodeURIComponent(pathPart);
            } else if (patternPart !== pathPart) {
                return null;
            }
        }

        return params;
    }

    private parseQuery(queryString: string): Record<string, string | string[]> {
        const query: Record<string, string | string[]> = {};
        if (!queryString) return query;

        const pairs = queryString.split('&');
        for (const pair of pairs) {
            // Bug #17: Skip empty keys from trailing ampersand
            if (!pair) continue;

            const [key, value] = pair.split('=');
            if (!key) continue;

            const decodedKey = decodeURIComponent(key);
            // Bug #16: Plus sign decoded to space
            const decodedValue = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';

            // Bug #10: Duplicate query keys - store as array
            if (decodedKey in query) {
                const existing = query[decodedKey];
                if (Array.isArray(existing)) {
                    existing.push(decodedValue);
                } else {
                    query[decodedKey] = [existing, decodedValue];
                }
            } else {
                query[decodedKey] = decodedValue;
            }
        }

        return query;
    }

    private buildQueryString(query: Record<string, string | string[]>): string {
        const parts: string[] = [];

        for (const key in query) {
            const value = query[key];
            if (value === undefined || value === null) continue;

            if (Array.isArray(value)) {
                for (const v of value) {
                    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(v)}`);
                }
            } else {
                parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
            }
        }

        return parts.join('&');
    }

    private encodeRoute(route: string, params: Record<string, any>): string {
        let encoded = route;
        
        // Bug #14: Duplicate params - use replaceAll with regex
        for (const key in params) {
            const value = String(params[key]);
            const regex = new RegExp(`:${key}`, 'g');
            encoded = encoded.replace(regex, encodeURIComponent(value));
        }

        return encoded;
    }

    private validateRoutePattern(pattern: string): boolean {
        // Bug #9: Validate route patterns
        if (!pattern || pattern.length === 0) return false;
        if (pattern.includes('//')) return false;
        if (pattern.includes('::')) return false;
        
        // Bug #9: Reject patterns that don't start with '/'
        if (!pattern.startsWith('/')) return false;

        // Check for duplicate parameter names
        const paramMatches = pattern.match(/:([^\/]+)/g);
        if (paramMatches) {
            const paramNames = paramMatches.map(m => m.substring(1));
            const uniqueNames = new Set(paramNames);
            if (paramNames.length !== uniqueNames.size) {
                return false;
            }
        }

        return true;
    }

    private validateParameterTypes(params: Record<string, any>, metadata: any): boolean {
        // Bug #5: Validate parameter types from route pattern and metadata
        if (!metadata) return true;

        // Extract type constraints from route pattern (e.g., {id:int})
        const route = metadata.route || '';
        const typeConstraints = this.extractTypeConstraints(route);
        
        // Validate against type constraints
        for (const [paramName, expectedType] of Object.entries(typeConstraints)) {
            const value = params[paramName];
            if (value === undefined || value === null) continue;

            switch (expectedType) {
                case 'int':
                case 'number':
                    if (isNaN(Number(value)) || !Number.isInteger(Number(value))) return false;
                    break;
                case 'float':
                    if (isNaN(Number(value))) return false;
                    break;
                case 'bool':
                case 'boolean':
                    if (value !== 'true' && value !== 'false') return false;
                    break;
                case 'uuid':
                    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
                    if (!uuidRegex.test(value)) return false;
                    break;
            }
        }

        // Also check metadata.parameters if available
        if (metadata.parameters) {
            for (const param of metadata.parameters) {
                const value = params[param.name];
                if (value === undefined || value === null) continue;

                switch (param.type) {
                    case 'number':
                        if (isNaN(Number(value))) return false;
                        break;
                    case 'boolean':
                        if (value !== 'true' && value !== 'false') return false;
                        break;
                }
            }
        }

        return true;
    }

    private extractTypeConstraints(route: string): Record<string, string> {
        const constraints: Record<string, string> = {};
        // Match patterns like {id:int}, {name:string}, etc.
        const matches = route.match(/\{([^:}]+):([^}]+)\}/g);
        
        if (matches) {
            for (const match of matches) {
                const [, paramName, paramType] = match.match(/\{([^:}]+):([^}]+)\}/) || [];
                if (paramName && paramType) {
                    constraints[paramName] = paramType;
                }
            }
        }
        
        return constraints;
    }

    private validateRequiredParameters(route: string, params: Record<string, any>): boolean {
        // Bug #7: Validate required parameters
        const paramMatches = route.match(/:([^\/]+)/g);
        if (!paramMatches) return true;

        for (const match of paramMatches) {
            const paramName = match.substring(1);
            if (!(paramName in params) || params[paramName] === undefined) {
                return false;
            }
        }

        return true;
    }

    private buildCanonicalPath(route: string, params: Record<string, any>): string {
        // Bug #13: Build canonical path
        let canonical = route;
        for (const key in params) {
            const regex = new RegExp(`:${key}`, 'g');
            canonical = canonical.replace(regex, encodeURIComponent(params[key]));
        }
        return canonical;
    }

    private findCanonicalRoute(page: PageRegistration): string | null {
        // Bug #13: Find canonical route for a page
        for (const [route, registeredPage] of this.pages.entries()) {
            if (registeredPage === page && registeredPage.canonical !== false) {
                return route;
            }
        }
        return null;
    }

    private async destroyPage(): Promise<void> {
        if (this.currentPage) {
            await this.runtime.unmountComponent(this.currentPage);
            this.currentPage = null;
        }
    }

    getCurrentRoute(): string {
        return window.location.pathname || '/';
    }

    getCurrentParams(): Record<string, any> {
        return this.currentParams;
    }

    getCurrentQuery(): Record<string, string | string[]> {
        return this.currentQuery;
    }

    getCurrentState(): Record<string, any> {
        return this.currentState;
    }
}

class ComponentManager {
    private instances = new Map<string, ComponentInstance>();

    async create(id: string, element: HTMLElement, state: any, metadata: ComponentMetadata): Promise<ComponentInstance> {
        const instance: ComponentInstance = { 
            id, 
            element, 
            state, 
            nodes: new Map(),
            metadata 
        };
        this.instances.set(id, instance);

        // Call internal __render method
        if (typeof state.__render === 'function') {
            state.__render(element);
            instance.nodes = (state as any).__nodes || new Map();
        }

        // Wire up events
        this.wireEvents(instance, metadata);

        // Initial property updates
        this.initialRender(instance, metadata);

        // Lifecycle: onInit
        if (typeof state.onInit === 'function') {
            await state.onInit();
        }

        // Lifecycle: onAfterRender
        if (typeof state.onAfterRender === 'function') {
            await state.onAfterRender();
        }

        return instance;
    }

    private wireEvents(instance: ComponentInstance, metadata: ComponentMetadata): void {
        for (const evt of metadata.eventInstructions) {
            const node = instance.nodes.get(evt.nodeId) as HTMLElement;
            if (node && typeof instance.state[evt.handler] === 'function') {
                // Convert event name to lowercase for DOM addEventListener
                const eventName = evt.event.toLowerCase();
                node.addEventListener(eventName, (e: Event) => {
                    instance.state[evt.handler].call(instance.state, e);
                });
            }
        }
    }

    private initialRender(instance: ComponentInstance, metadata: ComponentMetadata): void {
        // Get unique properties from dependency graph
        const properties = new Set(metadata.dependencyGraph.map(d => d.source));
        for (const prop of properties) {
            if (typeof instance.state.__update === 'function') {
                instance.state.__update(prop);
            }
        }
    }

    async destroy(id: string): Promise<void> {
        const instance = this.instances.get(id);
        if (!instance) return;

        try {
            // Lifecycle: __dispose() (calls onDestroy, __disposeChildren, and cleanup)
            if (typeof instance.state.__dispose === 'function') {
                await instance.state.__dispose();
            }
        } finally {
            // Always clear DOM and remove instance, even if disposal throws
            instance.element.innerHTML = '';
            this.instances.delete(id);
        }
    }

    update(id: string, prop: string): void {
        const instance = this.instances.get(id);
        if (!instance) return;

        if (typeof instance.state.__update === 'function') {
            instance.state.__update(prop);
        }
    }

    get(id: string): ComponentInstance | undefined {
        return this.instances.get(id);
    }
}

// ============================================================
// INTERNAL RUNTIME - Never exposed to application code
// ============================================================

class SoftRuntime {
    private componentManager: ComponentManager;
    private serviceContainer: ServiceContainer;
    private router: Router;
    private stateMap = new Map<string, any>();
    private manifest: ApplicationManifest | null = null;

    constructor() {
        this.componentManager = new ComponentManager();
        this.serviceContainer = new ServiceContainer();
        this.router = new Router(this);

        ProxyFactory.setDependencyExecutor((target, prop) => {
            for (const [id, state] of this.stateMap) {
                if (state === target || this.containsObject(state, target)) {
                    this.componentManager.update(id, prop);
                    break;
                }
            }
        });
    }

    private containsObject(parent: any, target: any): boolean {
        if (parent === target) return true;
        if (typeof parent !== 'object' || parent === null) return false;
        for (const key of Object.keys(parent)) {
            if (this.containsObject(parent[key], target)) return true;
        }
        return false;
    }

    setManifest(manifest: ApplicationManifest): void {
        this.manifest = manifest;
    }

    async initialize(container: HTMLElement): Promise<void> {
        if (!this.manifest) {
            throw new Error('Application manifest not loaded');
        }

        // Register services
        for (const service of this.manifest.services) {
            this.serviceContainer.register(service.name, service.factory);
        }

        // Register pages with router
        for (const page of this.manifest.pages) {
            this.router.register(page);
        }

        // Set router container
        this.router.setContainer(container);

        // Handle browser navigation
        window.addEventListener('popstate', () => {
            this.router.navigate(this.router.getCurrentRoute());
        });

        // Navigate to current route
        await this.router.navigate(this.router.getCurrentRoute());
    }

    async mountComponent(id: string, element: HTMLElement, state: any, metadata: ComponentMetadata): Promise<ComponentInstance> {
        const wrappedState = ProxyFactory.wrap(state);
        // Store the wrapped state for comparison in dependency executor
        this.stateMap.set(id, wrappedState);
        return await this.componentManager.create(id, element, wrappedState, metadata);
    }

    async unmountComponent(instance: ComponentInstance): Promise<void> {
        this.stateMap.delete(instance.id);
        await this.componentManager.destroy(instance.id);
    }

    resolveService<T>(name: string): T {
        return this.serviceContainer.resolve<T>(name);
    }
}

// ============================================================
// PUBLIC API - The ONLY thing exposed to application code
// ============================================================

let runtimeInstance: SoftRuntime | null = null;
let manifestData: ApplicationManifest | null = null;

/**
 * Register the application manifest (called by generated bootstrap)
 * This is an internal API - developers never call this directly
 */
export function __registerManifest(manifest: ApplicationManifest): void {
    manifestData = manifest;
}

/**
 * The Soft Framework
 * 
 * Usage:
 *   Soft.start("#app");
 *   Soft.start(document.body);
 */
export const Soft = {
    /**
     * Start the Soft application
     * @param container - CSS selector or HTMLElement
     */
    async start(container: string | HTMLElement): Promise<void> {
        // Resolve container
        const element = typeof container === 'string' 
            ? document.querySelector(container) as HTMLElement
            : container;

        if (!element) {
            throw new Error(`Container not found: ${container}`);
        }

        // Create runtime
        runtimeInstance = new SoftRuntime();

        // Expose runtime globally for DI
        (window as any).__softRuntime = runtimeInstance;

        // Load manifest
        if (!manifestData) {
            throw new Error('Application manifest not registered. Ensure bootstrap is loaded.');
        }

        runtimeInstance.setManifest(manifestData);

        // Initialize application
        await runtimeInstance.initialize(element);
    }
};
