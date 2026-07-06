/**
 * Core Observer
 * Central property change notification system.
 * All modules subscribe to this for property change notifications.
 */

type ObserverCallback = (target: any, prop: string, value: any) => void;

class CoreObserver {
  private callbacks: Set<ObserverCallback> = new Set();

  subscribe(callback: ObserverCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }

  notify(target: any, prop: string, value: any): void {
    for (const callback of this.callbacks) {
      callback(target, prop, value);
    }
  }
}

export const observer = new CoreObserver();
