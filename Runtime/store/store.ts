/**
 * State persistence service for Soft applications.
 * Provides localStorage persistence for component state.
 * 
 * NOTE: Observer infrastructure removed - use Core Proxy for reactivity.
 */

export class StatePersistence {
    private state: Record<string, any> = {};
    private persistKeys: Set<string> = new Set();
    private storageKey = '__soft_store__';
    
    constructor() {
        this.loadFromStorage();
    }
    
    /**
     * Get a state value
     */
    get<T = any>(key: string): T {
        return this.state[key];
    }
    
    /**
     * Set a state value with optional persistence
     */
    set(key: string, value: any, persist = false): void {
        this.state[key] = value;
        
        if (persist) {
            this.persistKeys.add(key);
        }
        
        // Persist if needed
        if (persist || this.persistKeys.has(key)) {
            this.saveToStorage();
        }
    }
    
    /**
     * Get all state
     */
    getState(): Record<string, any> {
        return { ...this.state };
    }
    
    /**
     * Reset all state
     */
    reset(): void {
        this.state = {};
        this.persistKeys.clear();
        this.saveToStorage();
    }
    
    /**
     * Save state to localStorage
     */
    private saveToStorage(): void {
        if (typeof localStorage === 'undefined') return;
        
        const persistedState: Record<string, any> = {};
        this.persistKeys.forEach(key => {
            persistedState[key] = this.state[key];
        });
        
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(persistedState));
        } catch (e) {
            console.warn('Failed to persist state:', e);
        }
    }
    
    /**
     * Load state from localStorage
     */
    private loadFromStorage(): void {
        if (typeof localStorage === 'undefined') return;
        
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                const persistedState = JSON.parse(stored);
                Object.keys(persistedState).forEach(key => {
                    this.state[key] = persistedState[key];
                    this.persistKeys.add(key);
                });
            }
        } catch (e) {
            console.warn('Failed to load persisted state:', e);
        }
    }
}

// Global persistence instance
export const statePersistence = new StatePersistence();

// Make available globally for backward compatibility
if (typeof window !== 'undefined') {
    (window as any).$store = statePersistence;
}
