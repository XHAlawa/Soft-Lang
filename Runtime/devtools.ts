/**
 * DevTools integration for Soft state management.
 * Provides state inspection and time-travel debugging.
 */

import { statePersistence } from './store';

interface StateSnapshot {
    timestamp: number;
    state: Record<string, any>;
    action?: string;
}

export class DevTools {
    private history: StateSnapshot[] = [];
    private maxHistory = 50;
    private currentIndex = -1;
    
    constructor() {
        this.recordSnapshot('INIT');
        
        // DevTools now requires manual state change tracking
        // Use Core Proxy for automatic notifications
        
        // Expose to window for browser devtools
        if (typeof window !== 'undefined') {
            (window as any).__SOFT_DEVTOOLS__ = this;
        }
    }
    
    private recordSnapshot(action: string): void {
        // Remove future history if we're in the middle
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        const snapshot: StateSnapshot = {
            timestamp: Date.now(),
            state: statePersistence.getState(),
            action
        };
        
        this.history.push(snapshot);
        this.currentIndex = this.history.length - 1;
        
        // Limit history size
        if (this.history.length > this.maxHistory) {
            this.history.shift();
            this.currentIndex--;
        }
        
        this.notifyDevTools();
    }
    
    /**
     * Get state history
     */
    getHistory(): StateSnapshot[] {
        return [...this.history];
    }
    
    /**
     * Jump to a specific point in history
     */
    jumpToState(index: number): void {
        if (index < 0 || index >= this.history.length) return;
        
        this.currentIndex = index;
        const snapshot = this.history[index];
        
        // Restore state
        Object.keys(snapshot.state).forEach(key => {
            statePersistence.set(key, snapshot.state[key]);
        });
    }
    
    /**
     * Undo last action
     */
    undo(): void {
        if (this.currentIndex > 0) {
            this.jumpToState(this.currentIndex - 1);
        }
    }
    
    /**
     * Redo last undone action
     */
    redo(): void {
        if (this.currentIndex < this.history.length - 1) {
            this.jumpToState(this.currentIndex + 1);
        }
    }
    
    /**
     * Get current state
     */
    getCurrentState(): Record<string, any> {
        return statePersistence.getState();
    }
    
    /**
     * Export state history
     */
    exportHistory(): string {
        return JSON.stringify(this.history, null, 2);
    }
    
    /**
     * Import state history
     */
    importHistory(json: string): void {
        try {
            const imported = JSON.parse(json);
            this.history = imported;
            this.currentIndex = this.history.length - 1;
            if (this.currentIndex >= 0) {
                this.jumpToState(this.currentIndex);
            }
        } catch (e) {
            console.error('Failed to import history:', e);
        }
    }
    
    private notifyDevTools(): void {
        // Dispatch custom event for browser extension
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('soft-state-change', {
                detail: {
                    state: this.getCurrentState(),
                    history: this.history,
                    currentIndex: this.currentIndex
                }
            }));
        }
    }
}

// Create global devtools instance
export const devtools = new DevTools();

// Console helpers
if (typeof window !== 'undefined') {
    (window as any).$state = () => devtools.getCurrentState();
    (window as any).$history = () => devtools.getHistory();
    (window as any).$undo = () => devtools.undo();
    (window as any).$redo = () => devtools.redo();
    
    console.log('%c🎯 Soft DevTools Ready', 'color: #00ff00; font-weight: bold');
    console.log('Available commands:');
    console.log('  $state()   - View current state');
    console.log('  $history() - View state history');
    console.log('  $undo()    - Undo last change');
    console.log('  $redo()    - Redo last change');
}
