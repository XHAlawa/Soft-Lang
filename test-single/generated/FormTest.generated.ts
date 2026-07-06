import { BindTest } from './BindTest.generated';
import { Child } from './Child.generated';
import { ClassTest } from './ClassTest.generated';
import { Counter } from './Counter.generated';
import { DeepNestTest } from './DeepNestTest.generated';
import { EventModifierTest } from './EventModifierTest.generated';
import { FormDirectiveTest } from './FormDirectiveTest.generated';
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

export class FormTest {
    name = '';
    email = '';
    age = 0;
    message = '';
    subscribe = false;

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
                        const el2 = document.createTextNode('Form Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Form Test');
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
                        let el4: HTMLDivElement;
        if (isFirstRender) {
            el4 = document.createElement('div') as HTMLDivElement;
        } else {
            el4 = container.children[3] as HTMLDivElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el4 = document.createElement('div') as HTMLDivElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
        }
        let el8: HTMLDivElement;
        if (isFirstRender) {
            el8 = document.createElement('div') as HTMLDivElement;
        } else {
            el8 = container.children[7] as HTMLDivElement;
            if (!el8 || el8.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el8 = document.createElement('div') as HTMLDivElement;
                if (container.children[7]) {
                    container.replaceChild(el8, container.children[7]);
                } else {
                        let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
                }
            }
        }

        if (isFirstRender) {
                let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
        }
        let el12: HTMLDivElement;
        if (isFirstRender) {
            el12 = document.createElement('div') as HTMLDivElement;
        } else {
            el12 = container.children[11] as HTMLDivElement;
            if (!el12 || el12.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el12 = document.createElement('div') as HTMLDivElement;
                if (container.children[11]) {
                    container.replaceChild(el12, container.children[11]);
                } else {
                        let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
                }
            }
        }

        if (isFirstRender) {
                let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
        }
        let el16: HTMLDivElement;
        if (isFirstRender) {
            el16 = document.createElement('div') as HTMLDivElement;
        } else {
            el16 = container.children[15] as HTMLDivElement;
            if (!el16 || el16.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el16 = document.createElement('div') as HTMLDivElement;
                if (container.children[15]) {
                    container.replaceChild(el16, container.children[15]);
                } else {
                        let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
                }
            }
        }

        if (isFirstRender) {
                let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
        }
        let el20: HTMLDivElement;
        if (isFirstRender) {
            el20 = document.createElement('div') as HTMLDivElement;
        } else {
            el20 = container.children[19] as HTMLDivElement;
            if (!el20 || el20.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el20 = document.createElement('div') as HTMLDivElement;
                if (container.children[19]) {
                    container.replaceChild(el20, container.children[19]);
                } else {
                        let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
                }
            }
        }

        if (isFirstRender) {
                let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
        }
    container.appendChild(el3);
                }
            }
        }

        if (isFirstRender) {
                let el4: HTMLDivElement;
        if (isFirstRender) {
            el4 = document.createElement('div') as HTMLDivElement;
        } else {
            el4 = container.children[3] as HTMLDivElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el4 = document.createElement('div') as HTMLDivElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
        }
        let el8: HTMLDivElement;
        if (isFirstRender) {
            el8 = document.createElement('div') as HTMLDivElement;
        } else {
            el8 = container.children[7] as HTMLDivElement;
            if (!el8 || el8.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el8 = document.createElement('div') as HTMLDivElement;
                if (container.children[7]) {
                    container.replaceChild(el8, container.children[7]);
                } else {
                        let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
                }
            }
        }

        if (isFirstRender) {
                let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
        }
        let el12: HTMLDivElement;
        if (isFirstRender) {
            el12 = document.createElement('div') as HTMLDivElement;
        } else {
            el12 = container.children[11] as HTMLDivElement;
            if (!el12 || el12.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el12 = document.createElement('div') as HTMLDivElement;
                if (container.children[11]) {
                    container.replaceChild(el12, container.children[11]);
                } else {
                        let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
                }
            }
        }

        if (isFirstRender) {
                let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
        }
        let el16: HTMLDivElement;
        if (isFirstRender) {
            el16 = document.createElement('div') as HTMLDivElement;
        } else {
            el16 = container.children[15] as HTMLDivElement;
            if (!el16 || el16.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el16 = document.createElement('div') as HTMLDivElement;
                if (container.children[15]) {
                    container.replaceChild(el16, container.children[15]);
                } else {
                        let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
                }
            }
        }

        if (isFirstRender) {
                let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
        }
        let el20: HTMLDivElement;
        if (isFirstRender) {
            el20 = document.createElement('div') as HTMLDivElement;
        } else {
            el20 = container.children[19] as HTMLDivElement;
            if (!el20 || el20.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el20 = document.createElement('div') as HTMLDivElement;
                if (container.children[19]) {
                    container.replaceChild(el20, container.children[19]);
                } else {
                        let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
                }
            }
        }

        if (isFirstRender) {
                let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
        }
    container.appendChild(el3);
        }
        let el24: HTMLDivElement;
        if (isFirstRender) {
            el24 = document.createElement('div') as HTMLDivElement;
        } else {
            el24 = container.children[23] as HTMLDivElement;
            if (!el24 || el24.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el24 = document.createElement('div') as HTMLDivElement;
                if (container.children[23]) {
                    container.replaceChild(el24, container.children[23]);
                } else {
                        let el25: HTMLParagraphElement;
        if (isFirstRender) {
            el25 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el25 = container.children[24] as HTMLParagraphElement;
            if (!el25 || el25.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el25 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[24]) {
                    container.replaceChild(el25, container.children[24]);
                } else {
                        const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
                }
            }
        }

        if (isFirstRender) {
                const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
        }
        let el27: HTMLParagraphElement;
        if (isFirstRender) {
            el27 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el27 = container.children[26] as HTMLParagraphElement;
            if (!el27 || el27.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el27 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[26]) {
                    container.replaceChild(el27, container.children[26]);
                } else {
                        const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
                }
            }
        }

        if (isFirstRender) {
                const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
        }
        let el29: HTMLParagraphElement;
        if (isFirstRender) {
            el29 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el29 = container.children[28] as HTMLParagraphElement;
            if (!el29 || el29.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el29 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[28]) {
                    container.replaceChild(el29, container.children[28]);
                } else {
                        const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
                }
            }
        }

        if (isFirstRender) {
                const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
        }
        let el31: HTMLParagraphElement;
        if (isFirstRender) {
            el31 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el31 = container.children[30] as HTMLParagraphElement;
            if (!el31 || el31.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el31 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[30]) {
                    container.replaceChild(el31, container.children[30]);
                } else {
                        const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
                }
            }
        }

        if (isFirstRender) {
                const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
        }
        let el33: HTMLParagraphElement;
        if (isFirstRender) {
            el33 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el33 = container.children[32] as HTMLParagraphElement;
            if (!el33 || el33.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el33 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[32]) {
                    container.replaceChild(el33, container.children[32]);
                } else {
                        const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
                }
            }
        }

        if (isFirstRender) {
                const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
        }
    container.appendChild(el24);
                }
            }
        }

        if (isFirstRender) {
                let el25: HTMLParagraphElement;
        if (isFirstRender) {
            el25 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el25 = container.children[24] as HTMLParagraphElement;
            if (!el25 || el25.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el25 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[24]) {
                    container.replaceChild(el25, container.children[24]);
                } else {
                        const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
                }
            }
        }

        if (isFirstRender) {
                const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
        }
        let el27: HTMLParagraphElement;
        if (isFirstRender) {
            el27 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el27 = container.children[26] as HTMLParagraphElement;
            if (!el27 || el27.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el27 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[26]) {
                    container.replaceChild(el27, container.children[26]);
                } else {
                        const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
                }
            }
        }

        if (isFirstRender) {
                const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
        }
        let el29: HTMLParagraphElement;
        if (isFirstRender) {
            el29 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el29 = container.children[28] as HTMLParagraphElement;
            if (!el29 || el29.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el29 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[28]) {
                    container.replaceChild(el29, container.children[28]);
                } else {
                        const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
                }
            }
        }

        if (isFirstRender) {
                const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
        }
        let el31: HTMLParagraphElement;
        if (isFirstRender) {
            el31 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el31 = container.children[30] as HTMLParagraphElement;
            if (!el31 || el31.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el31 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[30]) {
                    container.replaceChild(el31, container.children[30]);
                } else {
                        const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
                }
            }
        }

        if (isFirstRender) {
                const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
        }
        let el33: HTMLParagraphElement;
        if (isFirstRender) {
            el33 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el33 = container.children[32] as HTMLParagraphElement;
            if (!el33 || el33.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el33 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[32]) {
                    container.replaceChild(el33, container.children[32]);
                } else {
                        const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
                }
            }
        }

        if (isFirstRender) {
                const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
        }
    container.appendChild(el24);
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
                        const el2 = document.createTextNode('Form Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Form Test');
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
                        let el4: HTMLDivElement;
        if (isFirstRender) {
            el4 = document.createElement('div') as HTMLDivElement;
        } else {
            el4 = container.children[3] as HTMLDivElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el4 = document.createElement('div') as HTMLDivElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
        }
        let el8: HTMLDivElement;
        if (isFirstRender) {
            el8 = document.createElement('div') as HTMLDivElement;
        } else {
            el8 = container.children[7] as HTMLDivElement;
            if (!el8 || el8.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el8 = document.createElement('div') as HTMLDivElement;
                if (container.children[7]) {
                    container.replaceChild(el8, container.children[7]);
                } else {
                        let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
                }
            }
        }

        if (isFirstRender) {
                let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
        }
        let el12: HTMLDivElement;
        if (isFirstRender) {
            el12 = document.createElement('div') as HTMLDivElement;
        } else {
            el12 = container.children[11] as HTMLDivElement;
            if (!el12 || el12.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el12 = document.createElement('div') as HTMLDivElement;
                if (container.children[11]) {
                    container.replaceChild(el12, container.children[11]);
                } else {
                        let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
                }
            }
        }

        if (isFirstRender) {
                let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
        }
        let el16: HTMLDivElement;
        if (isFirstRender) {
            el16 = document.createElement('div') as HTMLDivElement;
        } else {
            el16 = container.children[15] as HTMLDivElement;
            if (!el16 || el16.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el16 = document.createElement('div') as HTMLDivElement;
                if (container.children[15]) {
                    container.replaceChild(el16, container.children[15]);
                } else {
                        let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
                }
            }
        }

        if (isFirstRender) {
                let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
        }
        let el20: HTMLDivElement;
        if (isFirstRender) {
            el20 = document.createElement('div') as HTMLDivElement;
        } else {
            el20 = container.children[19] as HTMLDivElement;
            if (!el20 || el20.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el20 = document.createElement('div') as HTMLDivElement;
                if (container.children[19]) {
                    container.replaceChild(el20, container.children[19]);
                } else {
                        let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
                }
            }
        }

        if (isFirstRender) {
                let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
        }
    container.appendChild(el3);
                }
            }
        }

        if (isFirstRender) {
                let el4: HTMLDivElement;
        if (isFirstRender) {
            el4 = document.createElement('div') as HTMLDivElement;
        } else {
            el4 = container.children[3] as HTMLDivElement;
            if (!el4 || el4.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el4 = document.createElement('div') as HTMLDivElement;
                if (container.children[3]) {
                    container.replaceChild(el4, container.children[3]);
                } else {
                        let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
                }
            }
        }

        if (isFirstRender) {
                let el5: HTMLElement;
        if (isFirstRender) {
            el5 = document.createElement('label') as HTMLElement;
        } else {
            el5 = container.children[4] as HTMLElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el5 = document.createElement('label') as HTMLElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        if (isFirstRender) {
                const el6 = document.createTextNode('Name:');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
        let el7: HTMLInputElement;
        if (isFirstRender) {
            el7 = document.createElement('input') as HTMLInputElement;
        } else {
            el7 = container.children[6] as HTMLInputElement;
            if (!el7 || el7.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el7 = document.createElement('input') as HTMLInputElement;
                if (container.children[6]) {
                    container.replaceChild(el7, container.children[6]);
                } else {
                    container.appendChild(el7);
                }
            }
        }

        el7.setAttribute('type', 'text');
        el7.setAttribute('data-focus-id', 'el7');
        el7.value = String(this.name ?? '');
        el7.addEventListener('input', (e) => {
            this.name = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el7);
        }
    container.appendChild(el4);
        }
        let el8: HTMLDivElement;
        if (isFirstRender) {
            el8 = document.createElement('div') as HTMLDivElement;
        } else {
            el8 = container.children[7] as HTMLDivElement;
            if (!el8 || el8.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el8 = document.createElement('div') as HTMLDivElement;
                if (container.children[7]) {
                    container.replaceChild(el8, container.children[7]);
                } else {
                        let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
                }
            }
        }

        if (isFirstRender) {
                let el9: HTMLElement;
        if (isFirstRender) {
            el9 = document.createElement('label') as HTMLElement;
        } else {
            el9 = container.children[8] as HTMLElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el9 = document.createElement('label') as HTMLElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        if (isFirstRender) {
                const el10 = document.createTextNode('Email:');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
        let el11: HTMLInputElement;
        if (isFirstRender) {
            el11 = document.createElement('input') as HTMLInputElement;
        } else {
            el11 = container.children[10] as HTMLInputElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el11 = document.createElement('input') as HTMLInputElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                    container.appendChild(el11);
                }
            }
        }

        el11.setAttribute('type', 'email');
        el11.setAttribute('data-focus-id', 'el11');
        el11.value = String(this.email ?? '');
        el11.addEventListener('input', (e) => {
            this.email = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el11);
        }
    container.appendChild(el8);
        }
        let el12: HTMLDivElement;
        if (isFirstRender) {
            el12 = document.createElement('div') as HTMLDivElement;
        } else {
            el12 = container.children[11] as HTMLDivElement;
            if (!el12 || el12.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el12 = document.createElement('div') as HTMLDivElement;
                if (container.children[11]) {
                    container.replaceChild(el12, container.children[11]);
                } else {
                        let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
                }
            }
        }

        if (isFirstRender) {
                let el13: HTMLElement;
        if (isFirstRender) {
            el13 = document.createElement('label') as HTMLElement;
        } else {
            el13 = container.children[12] as HTMLElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el13 = document.createElement('label') as HTMLElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        if (isFirstRender) {
                const el14 = document.createTextNode('Age:');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
        let el15: HTMLInputElement;
        if (isFirstRender) {
            el15 = document.createElement('input') as HTMLInputElement;
        } else {
            el15 = container.children[14] as HTMLInputElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el15 = document.createElement('input') as HTMLInputElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        el15.setAttribute('type', 'number');
        el15.setAttribute('data-focus-id', 'el15');
        el15.value = String(this.age ?? '');
        el15.addEventListener('input', (e) => {
            this.age = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el15);
        }
    container.appendChild(el12);
        }
        let el16: HTMLDivElement;
        if (isFirstRender) {
            el16 = document.createElement('div') as HTMLDivElement;
        } else {
            el16 = container.children[15] as HTMLDivElement;
            if (!el16 || el16.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el16 = document.createElement('div') as HTMLDivElement;
                if (container.children[15]) {
                    container.replaceChild(el16, container.children[15]);
                } else {
                        let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
                }
            }
        }

        if (isFirstRender) {
                let el17: HTMLElement;
        if (isFirstRender) {
            el17 = document.createElement('label') as HTMLElement;
        } else {
            el17 = container.children[16] as HTMLElement;
            if (!el17 || el17.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el17 = document.createElement('label') as HTMLElement;
                if (container.children[16]) {
                    container.replaceChild(el17, container.children[16]);
                } else {
                        const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
                }
            }
        }

        if (isFirstRender) {
                const el18 = document.createTextNode('Message:');
        if (isFirstRender) {
            container.appendChild(el18);
        }
    container.appendChild(el17);
        }
        let el19: HTMLTextAreaElement;
        if (isFirstRender) {
            el19 = document.createElement('textarea') as HTMLTextAreaElement;
        } else {
            el19 = container.children[18] as HTMLTextAreaElement;
            if (!el19 || el19.tagName.toLowerCase() !== 'textarea') {
                // Structure changed, rebuild this element
                el19 = document.createElement('textarea') as HTMLTextAreaElement;
                if (container.children[18]) {
                    container.replaceChild(el19, container.children[18]);
                } else {
                    container.appendChild(el19);
                }
            }
        }

        el19.setAttribute('data-focus-id', 'el19');
        el19.value = String(this.message ?? '');
        el19.addEventListener('input', (e) => {
            this.message = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el19);
        }
    container.appendChild(el16);
        }
        let el20: HTMLDivElement;
        if (isFirstRender) {
            el20 = document.createElement('div') as HTMLDivElement;
        } else {
            el20 = container.children[19] as HTMLDivElement;
            if (!el20 || el20.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el20 = document.createElement('div') as HTMLDivElement;
                if (container.children[19]) {
                    container.replaceChild(el20, container.children[19]);
                } else {
                        let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
                }
            }
        }

        if (isFirstRender) {
                let el21: HTMLElement;
        if (isFirstRender) {
            el21 = document.createElement('label') as HTMLElement;
        } else {
            el21 = container.children[20] as HTMLElement;
            if (!el21 || el21.tagName.toLowerCase() !== 'label') {
                // Structure changed, rebuild this element
                el21 = document.createElement('label') as HTMLElement;
                if (container.children[20]) {
                    container.replaceChild(el21, container.children[20]);
                } else {
                        const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
                }
            }
        }

        if (isFirstRender) {
                const el22 = document.createTextNode('Subscribe:');
        if (isFirstRender) {
            container.appendChild(el22);
        }
    container.appendChild(el21);
        }
        let el23: HTMLInputElement;
        if (isFirstRender) {
            el23 = document.createElement('input') as HTMLInputElement;
        } else {
            el23 = container.children[22] as HTMLInputElement;
            if (!el23 || el23.tagName.toLowerCase() !== 'input') {
                // Structure changed, rebuild this element
                el23 = document.createElement('input') as HTMLInputElement;
                if (container.children[22]) {
                    container.replaceChild(el23, container.children[22]);
                } else {
                    container.appendChild(el23);
                }
            }
        }

        el23.setAttribute('type', 'checkbox');
        el23.setAttribute('data-focus-id', 'el23');
        el23.checked = Boolean(this.subscribe);
        el23.addEventListener('change', (e) => {
            this.subscribe = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        if (isFirstRender) {
            container.appendChild(el23);
        }
    container.appendChild(el20);
        }
    container.appendChild(el3);
        }
        let el24: HTMLDivElement;
        if (isFirstRender) {
            el24 = document.createElement('div') as HTMLDivElement;
        } else {
            el24 = container.children[23] as HTMLDivElement;
            if (!el24 || el24.tagName.toLowerCase() !== 'div') {
                // Structure changed, rebuild this element
                el24 = document.createElement('div') as HTMLDivElement;
                if (container.children[23]) {
                    container.replaceChild(el24, container.children[23]);
                } else {
                        let el25: HTMLParagraphElement;
        if (isFirstRender) {
            el25 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el25 = container.children[24] as HTMLParagraphElement;
            if (!el25 || el25.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el25 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[24]) {
                    container.replaceChild(el25, container.children[24]);
                } else {
                        const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
                }
            }
        }

        if (isFirstRender) {
                const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
        }
        let el27: HTMLParagraphElement;
        if (isFirstRender) {
            el27 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el27 = container.children[26] as HTMLParagraphElement;
            if (!el27 || el27.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el27 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[26]) {
                    container.replaceChild(el27, container.children[26]);
                } else {
                        const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
                }
            }
        }

        if (isFirstRender) {
                const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
        }
        let el29: HTMLParagraphElement;
        if (isFirstRender) {
            el29 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el29 = container.children[28] as HTMLParagraphElement;
            if (!el29 || el29.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el29 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[28]) {
                    container.replaceChild(el29, container.children[28]);
                } else {
                        const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
                }
            }
        }

        if (isFirstRender) {
                const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
        }
        let el31: HTMLParagraphElement;
        if (isFirstRender) {
            el31 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el31 = container.children[30] as HTMLParagraphElement;
            if (!el31 || el31.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el31 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[30]) {
                    container.replaceChild(el31, container.children[30]);
                } else {
                        const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
                }
            }
        }

        if (isFirstRender) {
                const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
        }
        let el33: HTMLParagraphElement;
        if (isFirstRender) {
            el33 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el33 = container.children[32] as HTMLParagraphElement;
            if (!el33 || el33.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el33 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[32]) {
                    container.replaceChild(el33, container.children[32]);
                } else {
                        const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
                }
            }
        }

        if (isFirstRender) {
                const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
        }
    container.appendChild(el24);
                }
            }
        }

        if (isFirstRender) {
                let el25: HTMLParagraphElement;
        if (isFirstRender) {
            el25 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el25 = container.children[24] as HTMLParagraphElement;
            if (!el25 || el25.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el25 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[24]) {
                    container.replaceChild(el25, container.children[24]);
                } else {
                        const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
                }
            }
        }

        if (isFirstRender) {
                const el26 = document.createTextNode('Name: @name');
        if (isFirstRender) {
            container.appendChild(el26);
        }
    container.appendChild(el25);
        }
        let el27: HTMLParagraphElement;
        if (isFirstRender) {
            el27 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el27 = container.children[26] as HTMLParagraphElement;
            if (!el27 || el27.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el27 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[26]) {
                    container.replaceChild(el27, container.children[26]);
                } else {
                        const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
                }
            }
        }

        if (isFirstRender) {
                const el28 = document.createTextNode('Email: @email');
        if (isFirstRender) {
            container.appendChild(el28);
        }
    container.appendChild(el27);
        }
        let el29: HTMLParagraphElement;
        if (isFirstRender) {
            el29 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el29 = container.children[28] as HTMLParagraphElement;
            if (!el29 || el29.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el29 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[28]) {
                    container.replaceChild(el29, container.children[28]);
                } else {
                        const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
                }
            }
        }

        if (isFirstRender) {
                const el30 = document.createTextNode('Age: @age');
        if (isFirstRender) {
            container.appendChild(el30);
        }
    container.appendChild(el29);
        }
        let el31: HTMLParagraphElement;
        if (isFirstRender) {
            el31 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el31 = container.children[30] as HTMLParagraphElement;
            if (!el31 || el31.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el31 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[30]) {
                    container.replaceChild(el31, container.children[30]);
                } else {
                        const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
                }
            }
        }

        if (isFirstRender) {
                const el32 = document.createTextNode('Message: @message');
        if (isFirstRender) {
            container.appendChild(el32);
        }
    container.appendChild(el31);
        }
        let el33: HTMLParagraphElement;
        if (isFirstRender) {
            el33 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el33 = container.children[32] as HTMLParagraphElement;
            if (!el33 || el33.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el33 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[32]) {
                    container.replaceChild(el33, container.children[32]);
                } else {
                        const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
                }
            }
        }

        if (isFirstRender) {
                const el34 = document.createTextNode('Subscribe: @subscribe');
        if (isFirstRender) {
            container.appendChild(el34);
        }
    container.appendChild(el33);
        }
    container.appendChild(el24);
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
