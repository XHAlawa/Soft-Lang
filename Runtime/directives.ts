/**
 * Custom directive system for Soft.
 * Allows developers to create reusable DOM manipulation directives.
 */

export type DirectiveHook = (el: HTMLElement, value: any, oldValue?: any) => void;

export interface DirectiveDefinition {
    namespace: string;
    name: string;
    mounted?: DirectiveHook;
    updated?: DirectiveHook;
    unmounted?: DirectiveHook;
}

class DirectiveRegistry {
    private directives = new Map<string, DirectiveDefinition>();
    
    /**
     * Register a custom directive
     */
    register(namespace: string, name: string, definition: Partial<DirectiveDefinition>): void {
        const fullName = `${namespace}:${name}`;
        
        this.directives.set(fullName, {
            namespace,
            name,
            mounted: definition.mounted,
            updated: definition.updated,
            unmounted: definition.unmounted
        });
        
        console.log(`✓ Registered directive: @${fullName}`);
    }
    
    /**
     * Get a directive by full name
     */
    get(namespace: string, name: string): DirectiveDefinition | undefined {
        return this.directives.get(`${namespace}:${name}`);
    }
    
    /**
     * Apply directive to element
     */
    apply(el: HTMLElement, namespace: string, name: string, value: any): void {
        const directive = this.get(namespace, name);
        
        if (!directive) {
            console.warn(`Directive @${namespace}:${name} not found`);
            return;
        }
        
        // Store directive state on element
        if (!el.__directives) {
            el.__directives = new Map();
        }
        
        const key = `${namespace}:${name}`;
        const oldValue = el.__directives.get(key);
        
        // Call mounted on first apply
        if (!el.__directives.has(key) && directive.mounted) {
            directive.mounted(el, value);
        }
        // Call updated on value change
        else if (directive.updated && oldValue !== value) {
            directive.updated(el, value, oldValue);
        }
        
        el.__directives.set(key, value);
    }
    
    /**
     * Remove directive from element
     */
    remove(el: HTMLElement, namespace: string, name: string): void {
        const directive = this.get(namespace, name);
        const key = `${namespace}:${name}`;
        
        if (directive?.unmounted && el.__directives?.has(key)) {
            const value = el.__directives.get(key);
            directive.unmounted(el, value);
        }
        
        el.__directives?.delete(key);
    }
    
    /**
     * List all registered directives
     */
    list(): string[] {
        return Array.from(this.directives.keys());
    }
}

export const directiveRegistry = new DirectiveRegistry();

// Make available globally
if (typeof window !== 'undefined') {
    (window as any).__SOFT_DIRECTIVES__ = directiveRegistry;
}

// Extend HTMLElement type
declare global {
    interface HTMLElement {
        __directives?: Map<string, any>;
    }
}
