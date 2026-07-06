interface RouteRegistration {
    pattern: string;
    component: any;
    canonical: boolean;
    parameterTypes?: Record<string, string>;
}

interface RouteMatch {
    component: any;
    params: Record<string, any>;
    canonical: boolean;
    route: RouteRegistration;
}

interface NavigationOptions {
    replace?: boolean;
    state?: Record<string, any>;
}

class SoftRouter {
    private routes: RouteRegistration[] = [];
    public currentParams: Record<string, any> = {};
    public currentQuery: Record<string, string | string[]> = {};
    public currentState: Record<string, any> = {};
    private container: HTMLElement | null = null;
    private currentComponent: any = null;
    private isStarted = false;
    private popstateHandler: ((e: PopStateEvent) => void) | null = null;
    
    register(pattern: string, component: any, options: { canonical: boolean; parameterTypes?: Record<string, string> } = { canonical: true }): void {
        // Bug #13: Prevent duplicate route registration
        if (this.routes.some(r => r.pattern === pattern)) {
            console.warn(`Duplicate route registration: ${pattern}`);
            return;
        }
        
        // Bug #14: Validate route pattern
        if (!this.validateRoutePattern(pattern)) {
            throw new Error(`Invalid route pattern: ${pattern}`);
        }
        
        // Bug #5: Extract type constraints from route pattern and merge with options
        const extractedTypes = this.extractTypeConstraints(pattern);
        const parameterTypes = { ...extractedTypes, ...options.parameterTypes };
        
        this.routes.push({ 
            pattern, 
            component, 
            canonical: options.canonical,
            parameterTypes: parameterTypes
        });
    }
    
    start(containerSelector: string): void {
        this.container = document.querySelector(containerSelector);
        if (!this.container) {
            // Bug #18: Container not found - throw error instead of silent failure
            throw new Error(`Router container not found: ${containerSelector}`);
        }
        
        // Bug #23: Prevent popstate listener leak on repeated start() calls
        if (this.isStarted) {
            console.warn('Router already started. Ignoring duplicate start() call.');
            return;
        }
        
        this.isStarted = true;
        
        // Bug #23: Store handler reference for cleanup
        this.popstateHandler = (e: PopStateEvent) => {
            const state = e.state || {};
            // Bug #11: Restore state from history - check both e.state and window.history.state
            this.currentState = state.routeState || (window.history.state && window.history.state.routeState) || {};
            this.handleNavigation(window.location.pathname + window.location.search, false);
        };
        
        window.addEventListener('popstate', this.popstateHandler);
        
        // Bug #3: Defer initial navigation to allow routes to be registered via DOMContentLoaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.performInitialNavigation();
            });
        } else {
            // DOM already loaded, navigate immediately but with a microtask delay to allow route registration
            queueMicrotask(() => {
                this.performInitialNavigation();
            });
        }
    }

    stop(): void {
        // Bug #23: Cleanup popstate listener
        if (this.popstateHandler) {
            window.removeEventListener('popstate', this.popstateHandler);
            this.popstateHandler = null;
        }
        this.isStarted = false;
    }

    private performInitialNavigation(): void {
        // Bug #3: Handle initial route on page load after routes are registered
        // Bug #11: Restore state from initial history state
        const initialState = window.history.state || {};
        this.currentState = initialState.routeState || {};
        
        this.handleNavigation(window.location.pathname + window.location.search, false);
    }
    
    navigate(pattern: string, params: Record<string, any> = {}, query: Record<string, string | string[]> = {}, options: NavigationOptions | Record<string, any> = {}): void {
        // Bug #11: Handle state as 4th parameter for backward compatibility
        let navigationOptions: NavigationOptions;
        if ('replace' in options || 'state' in options) {
            navigationOptions = options as NavigationOptions;
        } else {
            // Treat 4th parameter as state object
            navigationOptions = { state: options as Record<string, any> };
        }
        
        // Bug #20: Validate input parameters BEFORE URL construction
        // Find the route registration to get parameter types
        const routeRegistration = this.routes.find(r => r.pattern === pattern);
        if (routeRegistration && routeRegistration.parameterTypes) {
            if (!this.validateParameterTypes(params, routeRegistration.parameterTypes)) {
                console.error(`Parameter type validation failed for pattern: ${pattern}`);
                return;
            }
        }
        
        let path = pattern;
        
        // Bug #14: Duplicate params - use replaceAll with regex
        for (const key in params) {
            const value = String(params[key]);
            const regex = new RegExp(`:${key}`, 'g');
            path = path.replace(regex, encodeURIComponent(value));
        }
        
        // Bug #6: Parse query parameters from URL
        // Bug #16: Plus sign in query not decoded to space
        // Bug #17: Trailing ampersand creates empty key entry
        const queryString = this.buildQueryString(query);
        const fullPath = queryString ? `${path}?${queryString}` : path;
        
        // Bug #7: Check if route matches before updating URL
        const match = this.matchRoute(path);
        if (!match) {
            console.error(`No route found for: ${path}`);
            return;
        }
        
        // Bug #5: Validate parameter types from route registration (redundant but kept for safety)
        if (!this.validateParameterTypes(match.params, match.route.parameterTypes)) {
            console.error(`Parameter type validation failed for route: ${path}`);
            return;
        }
        
        // Bug #16: Validate missing parameters
        if (!this.validateRequiredParameters(pattern, params)) {
            console.error(`Missing required parameters for route: ${path}`);
            return;
        }
        
        // Bug #11: Ensure state is properly saved to history
        this.currentState = navigationOptions.state || {};
        
        // Bug #11: Support replace navigation with proper state persistence
        const historyState = { routeState: this.currentState };
        if (navigationOptions.replace) {
            window.history.replaceState(historyState, '', fullPath);
        } else {
            window.history.pushState(historyState, '', fullPath);
        }
        
        this.handleNavigation(fullPath, true);
    }
    
    // Bug #12: Add explicit replace method for convenience
    replace(pattern: string, params: Record<string, any> = {}, query: Record<string, string | string[]> = {}, state: Record<string, any> = {}): void {
        this.navigate(pattern, params, query, { replace: true, state });
    }
    
    private handleNavigation(fullPath: string, fromNavigate: boolean): void {
        // Split path and query string
        const [pathname, queryString] = fullPath.split('?');
        
        // Bug #15: Strip hash fragment from pathname
        const hashIndex = pathname.indexOf('#');
        const cleanPathname = hashIndex >= 0 ? pathname.substring(0, hashIndex) : pathname;
        
        // Bug #2: Parse query parameters from URL
        this.currentQuery = this.parseQuery(queryString || '');
        
        const match = this.matchRoute(cleanPathname);
        if (!match) {
            console.error(`No route found for: ${cleanPathname}`);
            return;
        }
        
        // Bug #22: Validate parameter types even on popstate events
        if (!this.validateParameterTypes(match.params, match.route.parameterTypes)) {
            console.error(`Parameter type validation failed for route: ${cleanPathname}`);
            return;
        }
        
        // Bug #13: Alias route does not redirect to canonical
        if (!match.canonical && fromNavigate) {
            // Find the canonical route for this component
            const canonicalRoute = this.findCanonicalRoute(match.component);
            if (canonicalRoute) {
                const canonicalPath = this.buildCanonicalPath(canonicalRoute, match.params);
                this.navigate(canonicalPath, match.params, this.currentQuery, { replace: true });
                return;
            }
        }
        
        this.currentParams = match.params;
        
        if (!this.container) return;
        this.container.innerHTML = '';
        
        const ComponentClass = match.component;
        this.currentComponent = new ComponentClass();
        
        // Inject route/query/state into component
        if (this.currentComponent.params !== undefined) {
            this.currentComponent.params = this.currentParams;
        }
        if (this.currentComponent.query !== undefined) {
            this.currentComponent.query = this.currentQuery;
        }
        if (this.currentComponent.state !== undefined) {
            this.currentComponent.state = this.currentState;
        }
        
        // Bug #1: Navigation does not trigger render
        if (this.currentComponent.__render) {
            this.currentComponent.__render(this.container);
        }
    }
    
    private matchRoute(path: string): RouteMatch | null {
        for (const route of this.routes) {
            const result = this.matchPath(route.pattern, path);
            if (result !== null) {
                return { 
                    component: route.component, 
                    params: result,
                    canonical: route.canonical,
                    route: route
                };
            }
        }
        return null;
    }
    
    private matchPath(pattern: string, path: string): Record<string, any> | null {
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
                // Bug #5: Properly decode special characters
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
            if (!key) continue; // Bug #17: Skip if key is empty
            
            // Bug #21: Handle malformed URL encoding gracefully
            let decodedKey: string;
            let decodedValue: string;
            
            try {
                decodedKey = decodeURIComponent(key);
                // Bug #16: Plus sign in query not decoded to space
                decodedValue = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            } catch (e) {
                // Malformed encoding - use raw values
                console.warn(`Malformed URL encoding in query parameter: ${pair}`);
                decodedKey = key;
                decodedValue = value || '';
            }
            
            // Bug #6: Duplicate query keys - last value wins (change to array)
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
    
    private validateParameterTypes(params: Record<string, any>, types?: Record<string, string>): boolean {
        // Bug #5: Validate parameter type constraints including {id:int} patterns
        if (!types) return true;
        
        for (const key in types) {
            const expectedType = types[key];
            const value = params[key];
            
            if (value === undefined || value === null) continue;
            
            // Bug #20: Empty string should fail validation for non-string types
            if (value === '' && expectedType !== 'string') return false;
            
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
                case 'string':
                    if (typeof value !== 'string') return false;
                    break;
            }
        }
        
        return true;
    }
    
    private validateRequiredParameters(pattern: string, params: Record<string, any>): boolean {
        // Bug #16: Missing route parameters not validated
        const paramMatches = pattern.match(/:([^\/]+)/g);
        if (!paramMatches) return true;
        
        for (const match of paramMatches) {
            const paramName = match.substring(1);
            if (!(paramName in params) || params[paramName] === undefined) {
                return false;
            }
        }
        
        return true;
    }
    
    private buildCanonicalPath(pattern: string, params: Record<string, any>): string {
        // Bug #13: Build canonical path from pattern and params
        let canonical = pattern;
        for (const key in params) {
            const regex = new RegExp(`:${key}`, 'g');
            canonical = canonical.replace(regex, encodeURIComponent(params[key]));
        }
        return canonical;
    }

    private findCanonicalRoute(component: any): string | null {
        // Bug #13: Find canonical route for a component
        for (const route of this.routes) {
            if (route.component === component && route.canonical !== false) {
                return route.pattern;
            }
        }
        return null;
    }

    private extractTypeConstraints(pattern: string): Record<string, string> {
        // Bug #5: Extract type constraints from route pattern
        const constraints: Record<string, string> = {};
        
        // Support {id:int} syntax for backward compatibility
        let matches = pattern.match(/\{([^:}]+):([^}]+)\}/g);
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
}

const __router = new SoftRouter();

if (typeof window !== 'undefined') {
    (window as any).SoftRouter = __router;
    (window as any).__router = __router;
}

if (typeof globalThis !== 'undefined') {
    (globalThis as any).__router = __router;
}

export { __router };
