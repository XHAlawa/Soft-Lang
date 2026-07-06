import { BindTest } from './BindTest.generated';
import { Child } from './Child.generated';
import { ClassTest } from './ClassTest.generated';
import { Counter } from './Counter.generated';
import { DeepNestTest } from './DeepNestTest.generated';
import { EventModifierTest } from './EventModifierTest.generated';
import { FormTest } from './FormTest.generated';
import { IfTest } from './IfTest.generated';
import { LevelA } from './LevelA.generated';
import { LevelB } from './LevelB.generated';
import { LevelC } from './LevelC.generated';
import { LifecycleTest } from './LifecycleTest.generated';
import { LocalizationTest } from './LocalizationTest.generated';
import { ManualFormTest } from './ManualFormTest.generated';
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

export class FormDirectiveTest {
    name = '';
    email = '';

    submitForm() {
      console.log('Form submitted', this.name, this.email);
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
                        const el2 = document.createTextNode('Form Directive Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Form Directive Test');
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
                        let el4: HTMLParagraphElement;
        if (isFirstRender) {
            el4 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el4 = container.children[3] as HTMLParagraphElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el4 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
        }
        let el7: HTMLParagraphElement;
        if (isFirstRender) {
            el7 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el7 = container.children[6] as HTMLParagraphElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el7 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                        const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
                }
            }
        }

        if (isFirstRender) {
                const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
        }
        let el10: HTMLButtonElement;
        if (isFirstRender) {
            el10 = document.createElement('button') as HTMLButtonElement;
        } else {
            el10 = container.children[9] as HTMLButtonElement;
            if (!el10 || el10.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el10 = document.createElement('button') as HTMLButtonElement;
                if (container.children[9]) {
                    container.replaceChild(el10, container.children[9]);
                } else {
                        const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
                }
            }
        }

        el10.setAttribute('type', 'submit');
        if (isFirstRender) {
                const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
        }
    container.appendChild(el3);
                }
            }
        }

        el3.setAttribute('id', 'test-form');
        if (isFirstRender) {
                let el4: HTMLParagraphElement;
        if (isFirstRender) {
            el4 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el4 = container.children[3] as HTMLParagraphElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el4 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
        }
        let el7: HTMLParagraphElement;
        if (isFirstRender) {
            el7 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el7 = container.children[6] as HTMLParagraphElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el7 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                        const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
                }
            }
        }

        if (isFirstRender) {
                const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
        }
        let el10: HTMLButtonElement;
        if (isFirstRender) {
            el10 = document.createElement('button') as HTMLButtonElement;
        } else {
            el10 = container.children[9] as HTMLButtonElement;
            if (!el10 || el10.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el10 = document.createElement('button') as HTMLButtonElement;
                if (container.children[9]) {
                    container.replaceChild(el10, container.children[9]);
                } else {
                        const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
                }
            }
        }

        el10.setAttribute('type', 'submit');
        if (isFirstRender) {
                const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
        }
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
                        const el2 = document.createTextNode('Form Directive Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Form Directive Test');
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
                        let el4: HTMLParagraphElement;
        if (isFirstRender) {
            el4 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el4 = container.children[3] as HTMLParagraphElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el4 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
        }
        let el7: HTMLParagraphElement;
        if (isFirstRender) {
            el7 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el7 = container.children[6] as HTMLParagraphElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el7 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                        const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
                }
            }
        }

        if (isFirstRender) {
                const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
        }
        let el10: HTMLButtonElement;
        if (isFirstRender) {
            el10 = document.createElement('button') as HTMLButtonElement;
        } else {
            el10 = container.children[9] as HTMLButtonElement;
            if (!el10 || el10.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el10 = document.createElement('button') as HTMLButtonElement;
                if (container.children[9]) {
                    container.replaceChild(el10, container.children[9]);
                } else {
                        const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
                }
            }
        }

        el10.setAttribute('type', 'submit');
        if (isFirstRender) {
                const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
        }
    container.appendChild(el3);
                }
            }
        }

        el3.setAttribute('id', 'test-form');
        if (isFirstRender) {
                let el4: HTMLParagraphElement;
        if (isFirstRender) {
            el4 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el4 = container.children[3] as HTMLParagraphElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el4 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                const el5 = document.createTextNode('Name: ');
        if (isFirstRender) {
            container.appendChild(el5);
        }
        let el6: HTMLInputElement;
        if (isFirstRender) {
            el6 = document.createElement('input') as HTMLInputElement;
        } else {
            el6 = container.children[5] as HTMLInputElement;
            if (!el6 || el6.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el6 = document.createElement('input') as HTMLInputElement;
                if (container.children[5]) {
                    container.replaceChild(el6, container.children[5]);
                } else {
                    container.appendChild(el6);
                }
            }
        }

        el6.setAttribute('data-focus-id', 'el6');
        el6.value = String(this.name ?? '');
        el6.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el4);
        }
        let el7: HTMLParagraphElement;
        if (isFirstRender) {
            el7 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el7 = container.children[6] as HTMLParagraphElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el7 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                        const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
                }
            }
        }

        if (isFirstRender) {
                const el8 = document.createTextNode('Email: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLInputElement;
        if (isFirstRender) {
            el9 = document.createElement('input') as HTMLInputElement;
        } else {
            el9 = container.children[8] as HTMLInputElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el9 = document.createElement('input') as HTMLInputElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('data-focus-id', 'el9');
        el9.value = String(this.email ?? '');
        el9.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el9);
        }
    container.appendChild(el7);
        }
        let el10: HTMLButtonElement;
        if (isFirstRender) {
            el10 = document.createElement('button') as HTMLButtonElement;
        } else {
            el10 = container.children[9] as HTMLButtonElement;
            if (!el10 || el10.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el10 = document.createElement('button') as HTMLButtonElement;
                if (container.children[9]) {
                    container.replaceChild(el10, container.children[9]);
                } else {
                        const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
                }
            }
        }

        el10.setAttribute('type', 'submit');
        if (isFirstRender) {
                const el11 = document.createTextNode('Submit');
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el10);
        }
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
