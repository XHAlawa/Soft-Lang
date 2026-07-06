import { BindTest } from './BindTest.generated';
import { Child } from './Child.generated';
import { ClassTest } from './ClassTest.generated';
import { Counter } from './Counter.generated';
import { DeepNestTest } from './DeepNestTest.generated';
import { EventModifierTest } from './EventModifierTest.generated';
import { FormDirectiveTest } from './FormDirectiveTest.generated';
import { FormTest } from './FormTest.generated';
import { IfTest } from './IfTest.generated';
import { LevelA } from './LevelA.generated';
import { LevelB } from './LevelB.generated';
import { LevelC } from './LevelC.generated';
import { LifecycleTest } from './LifecycleTest.generated';
import { LocalizationTest } from './LocalizationTest.generated';
import { MultiBindTest } from './MultiBindTest.generated';
import { MultiEventTest } from './MultiEventTest.generated';
import { MultiInterpTest } from './MultiInterpTest.generated';
import { NestedIfTest } from './NestedIfTest.generated';
import { ParamTest } from './ParamTest.generated';
import { Parent } from './Parent.generated';
import { ProxyTest } from './ProxyTest.generated';
import { SimpleCodeTest } from './SimpleCodeTest.generated';
import { StateTest } from './StateTest.generated';
import { StyleTest } from './StyleTest.generated';
import { SwitchTest } from './SwitchTest.generated';
import { TextLiteralTest } from './TextLiteralTest.generated';

// Soft decorators:
// @Component

export class ManualFormTest {
    name = '';

    handleSubmit() {
      console.log('Submitted:', this.name);
    }

    // Router properties (injected at runtime)
    $route?: any;
    $navigate?: any;

    // Lifecycle state
    private __mounted = false;
    private __container?: HTMLElement;
    private __cacheStore = new Map<string, any>();
    private __cleanup: (() => void)[] = [];
    private __validationErrors?: Record<string, string | null>;
    private __touchedFields?: Record<string, boolean>;
    private __renderScheduled = false;

    // Schedule render with debouncing to prevent multiple queued renders
    private __scheduleRender(): void {
        if (this.__renderScheduled) return;
        this.__renderScheduled = true;
        queueMicrotask(() => {
            if (this.__mounted && this.__container) {
                this.__render(this.__container);
            }
        });
    }

    // Localization helper
    private __localize(key: string, fallback?: string): string {
        // Import localize function dynamically or use global
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

    // Auto-generated template rendering code
    public __render(container: HTMLElement): void {
        // Store container reference for re-renders
        this.__container = container;
        // Cancel any pending render to prevent double-rendering
        this.__renderScheduled = false;

        // Differential DOM update: only rebuild if first render or structure changed
        const isFirstRender = !this.__mounted || container.children.length === 0;
    
        if (isFirstRender) {
            // First render: build full DOM
            container.innerHTML = '';
        } else {
            // Subsequent renders: preserve DOM structure, only update dynamic content
            // Focus preservation is automatic since we don't destroy elements
        }

        let el0: HTMLDivElement;
        if (isFirstRender) {
            el0 = document.createElement('div') as HTMLDivElement;
        } else {
            el0 = container.children[-1] as HTMLDivElement;
            if (!el0 || el0.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el0 = document.createElement('div') as HTMLDivElement;
                if (container.children[-1]) {
                    container.replaceChild(el0, container.children[-1]);
                } else {
                        let el1: HTMLHeadingElement;
        if (isFirstRender) {
            el1 = document.createElement('h3') as HTMLHeadingElement;
        } else {
            el1 = container.children[0] as HTMLHeadingElement;
            if (!el1 || el1.tagName.toLowerCase() !== 'h3') {
                // Structure changed, rebuild this element
                el1 = document.createElement('h3') as HTMLHeadingElement;
                if (container.children[0]) {
                    container.replaceChild(el1, container.children[0]);
                } else {
                        const el2 = document.createTextNode('Manual Form Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Manual Form Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
        }
        let el3: HTMLFormElement;
        if (isFirstRender) {
            el3 = document.createElement('form') as HTMLFormElement;
        } else {
            el3 = container.children[2] as HTMLFormElement;
            if (!el3 || el3.tagName.toLowerCase() !== 'form') {
                // Structure changed, rebuild this element
                el3 = document.createElement('form') as HTMLFormElement;
                if (container.children[2]) {
                    container.replaceChild(el3, container.children[2]);
                } else {
                    container.appendChild(el3);
                }
            }
        }

        const handler_el3_submit = (e) => {
            e.preventDefault();
            this.handleSubmit();
            this.__scheduleRender();
        };

        el3.addEventListener('submit', handler_el3_submit);
        let el4: HTMLInputElement;
        if (isFirstRender) {
            el4 = document.createElement('input') as HTMLInputElement;
        } else {
            el4 = container.children[3] as HTMLInputElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el4 = document.createElement('input') as HTMLInputElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                    container.appendChild(el4);
                }
            }
        }

        el4.setAttribute('data-focus-id', 'el4');
        el4.value = String(this.name ?? '');
        el4.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el4);
        }
        let el5: HTMLButtonElement;
        if (isFirstRender) {
            el5 = document.createElement('button') as HTMLButtonElement;
        } else {
            el5 = container.children[4] as HTMLButtonElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el5 = document.createElement('button') as HTMLButtonElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        el5.setAttribute('type', 'submit');
        if (isFirstRender) {
                const el6 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        this.__cleanup.push(() => el3.removeEventListener('submit', handler_el3_submit));
        if (isFirstRender) {
            container.appendChild(el3);
        }
    container.appendChild(el0);
                }
            }
        }

        if (isFirstRender) {
                let el1: HTMLHeadingElement;
        if (isFirstRender) {
            el1 = document.createElement('h3') as HTMLHeadingElement;
        } else {
            el1 = container.children[0] as HTMLHeadingElement;
            if (!el1 || el1.tagName.toLowerCase() !== 'h3') {
                // Structure changed, rebuild this element
                el1 = document.createElement('h3') as HTMLHeadingElement;
                if (container.children[0]) {
                    container.replaceChild(el1, container.children[0]);
                } else {
                        const el2 = document.createTextNode('Manual Form Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Manual Form Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
        }
        let el3: HTMLFormElement;
        if (isFirstRender) {
            el3 = document.createElement('form') as HTMLFormElement;
        } else {
            el3 = container.children[2] as HTMLFormElement;
            if (!el3 || el3.tagName.toLowerCase() !== 'form') {
                // Structure changed, rebuild this element
                el3 = document.createElement('form') as HTMLFormElement;
                if (container.children[2]) {
                    container.replaceChild(el3, container.children[2]);
                } else {
                    container.appendChild(el3);
                }
            }
        }

        const handler_el3_submit = (e) => {
            e.preventDefault();
            this.handleSubmit();
            this.__scheduleRender();
        };

        el3.addEventListener('submit', handler_el3_submit);
        let el4: HTMLInputElement;
        if (isFirstRender) {
            el4 = document.createElement('input') as HTMLInputElement;
        } else {
            el4 = container.children[3] as HTMLInputElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el4 = document.createElement('input') as HTMLInputElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                    container.appendChild(el4);
                }
            }
        }

        el4.setAttribute('data-focus-id', 'el4');
        el4.value = String(this.name ?? '');
        el4.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el4);
        }
        let el5: HTMLButtonElement;
        if (isFirstRender) {
            el5 = document.createElement('button') as HTMLButtonElement;
        } else {
            el5 = container.children[4] as HTMLButtonElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el5 = document.createElement('button') as HTMLButtonElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        el5.setAttribute('type', 'submit');
        if (isFirstRender) {
                const el6 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        this.__cleanup.push(() => el3.removeEventListener('submit', handler_el3_submit));
        if (isFirstRender) {
            container.appendChild(el3);
        }
    container.appendChild(el0);
        }

        if (!this.__mounted && (this as any).onMounted) {
            this.__mounted = true;
            setTimeout(() => (this as any).onMounted?.(), 0);
        } else if ((this as any).onUpdated) {
            setTimeout(() => (this as any).onUpdated?.(), 0);
        }
    }

}
