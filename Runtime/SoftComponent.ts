// Runtime base class for all Soft components
export abstract class SoftComponent {
    // Lifecycle state
    protected __mounted = false;
    protected __container?: HTMLElement;
    protected __cacheStore = new Map<string, any>();
    protected __cleanup: (() => void)[] = [];
    protected __validationErrors?: Record<string, string | null>;
    protected __touchedFields?: Record<string, boolean>;
    protected __renderScheduled = false;

    // Schedule render with debouncing to prevent multiple queued renders
    protected __scheduleRender(): void {
        if (this.__renderScheduled) return;
        this.__renderScheduled = true;
        queueMicrotask(() => {
            if (this.__mounted && this.__container) {
                this.__render(this.__container);
            }
        });
    }

    // Localization helper
    protected __localize(key: string, fallback?: string): string {
        return (globalThis as any).__softLocalize?.(key, fallback) || fallback || key;
    }

    // Component disposal (compiler-generated)
    __dispose(): void {
        // Dispose children first
        (this as any).__disposeChildren?.();
        
        // Then own cleanup
        (this as any).onDestroy?.();
        this.__cleanup.forEach(fn => fn());
        this.__cleanup = [];
        this.__mounted = false;
    }

    // Abstract render method - implemented by generated code
    abstract __render(container: HTMLElement): void;
    
    // Helper: Create element with attributes and events in one call
    protected createElement<K extends keyof HTMLElementTagNameMap>(
        tag: K,
        attrs?: Record<string, string>,
        events?: Record<string, (e: Event) => void>,
        parent?: HTMLElement
    ): HTMLElementTagNameMap[K] {
        const el = document.createElement(tag);
        
        if (attrs) {
            for (const [key, value] of Object.entries(attrs)) {
                el.setAttribute(key, value);
            }
        }
        
        if (events) {
            for (const [event, handler] of Object.entries(events)) {
                el.addEventListener(event, handler);
                this.__cleanup.push(() => el.removeEventListener(event, handler));
            }
        }
        
        if (parent) {
            parent.appendChild(el);
        }
        
        return el;
    }
}
