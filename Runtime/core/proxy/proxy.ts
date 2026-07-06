/**
 * Core Proxy Factory
 * Provides reactive proxy wrapping for object state changes.
 * 
 * Core infrastructure - depends on nothing.
 */

import { observer } from '../observer/index';

export class ProxyFactory {
    private static dependencyExecutor: ((target: any, prop: string, value: any) => void) | null = null;

    static setDependencyExecutor(executor: (target: any, prop: string, value: any) => void): void {
        this.dependencyExecutor = executor;
    }

    static wrap<T extends object>(target: T): T {
        const self = this;
        
        return new Proxy(target, {
            set(obj: any, prop: string, value: any): boolean {
                const oldValue = obj[prop];
                obj[prop] = value;

                if (oldValue !== value) {
                    if (self.dependencyExecutor) {
                        self.dependencyExecutor(obj, prop, value);
                    }
                    observer.notify(obj, prop, value);
                }

                return true;
            },
            get(obj: any, prop: string): any {
                const value = obj[prop];

                // Don't wrap built-in objects that have special behavior
                if (value instanceof Map || value instanceof Set || 
                    value instanceof WeakMap || value instanceof WeakSet ||
                    value instanceof Date || value instanceof RegExp) {
                    return value;
                }

                if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                    return self.wrap(value);
                }

                if (Array.isArray(value)) {
                    return self.wrapArray(value, obj, prop);
                }

                return value;
            }
        });
    }

    static wrapArray<T>(arr: T[], parent: any, prop: string): T[] {
        const self = this;
        const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

        return new Proxy(arr, {
            get(target: any, p: string): any {
                if (methods.includes(p)) {
                    return (...args: any[]) => {
                        const result = (target as any)[p](...args);
                        if (self.dependencyExecutor) {
                            self.dependencyExecutor(parent, prop, target);
                        }
                        return result;
                    };
                }
                return target[p];
            },
            set(target: any, index: string, value: any): boolean {
                target[index] = value;
                if (self.dependencyExecutor) {
                    self.dependencyExecutor(parent, prop, target);
                }
                return true;
            }
        });
    }
}
