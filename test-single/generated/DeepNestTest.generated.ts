import { BindTest } from './BindTest.generated';
import { Child } from './Child.generated';
import { ClassTest } from './ClassTest.generated';
import { Counter } from './Counter.generated';
import { EventModifierTest } from './EventModifierTest.generated';
import { FormDirectiveTest } from './FormDirectiveTest.generated';
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

export class DeepNestTest {

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
        private __el3: LevelA | null = null;
        private __el4: LevelB | null = null;
        private __el5: LevelC | null = null;

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
                        const el2 = document.createTextNode('Deep Nesting Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Deep Nesting Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
        }
        if (!this.__el3) {
            this.__el3 = new LevelA();
        }
        const el3 = this.__el3;
        const el3_container = document.createElement('div');
        // Pass slot content to child
        (el3 as any).__slots = {};
        const slotContent_el3 = [];
        (el3 as any).__slots['default'] = slotContent_el3;
        el3.__render(el3_container);
            if (!this.__el4) {
            this.__el4 = new LevelB();
        }
        const el4 = this.__el4;
        const el4_container = document.createElement('div');
        // Pass slot content to child
        (el4 as any).__slots = {};
        const slotContent_el4 = [];
        (el4 as any).__slots['default'] = slotContent_el4;
        el4.__render(el4_container);
        if (!this.__el5) {
            this.__el5 = new LevelC();
        }
        const el5 = this.__el5;
        const el5_container = document.createElement('div');
        // Pass slot content to child
        (el5 as any).__slots = {};
        el5.__render(el5_container);

        slotContent_el4.push(el5_container);
        slotContent_el3.push(el4_container);
    container.appendChild(el3_container);
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
                        const el2 = document.createTextNode('Deep Nesting Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Deep Nesting Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
        }
        if (!this.__el3) {
            this.__el3 = new LevelA();
        }
        const el3 = this.__el3;
        const el3_container = document.createElement('div');
        // Pass slot content to child
        (el3 as any).__slots = {};
        const slotContent_el3 = [];
        (el3 as any).__slots['default'] = slotContent_el3;
        el3.__render(el3_container);
            if (!this.__el4) {
            this.__el4 = new LevelB();
        }
        const el4 = this.__el4;
        const el4_container = document.createElement('div');
        // Pass slot content to child
        (el4 as any).__slots = {};
        const slotContent_el4 = [];
        (el4 as any).__slots['default'] = slotContent_el4;
        el4.__render(el4_container);
        if (!this.__el5) {
            this.__el5 = new LevelC();
        }
        const el5 = this.__el5;
        const el5_container = document.createElement('div');
        // Pass slot content to child
        (el5 as any).__slots = {};
        el5.__render(el5_container);

        slotContent_el4.push(el5_container);
        slotContent_el3.push(el4_container);
    container.appendChild(el3_container);
    container.appendChild(el0);
        }

        if (!this.__mounted && (this as any).onMounted) {
            this.__mounted = true;
            setTimeout(() => (this as any).onMounted?.(), 0);
        } else if ((this as any).onUpdated) {
            setTimeout(() => (this as any).onUpdated?.(), 0);
        }
    }

        // Dispose child components (compiler-generated)
        __disposeChildren(): void {
            this.__el3?.__dispose();
            this.__el4?.__dispose();
            this.__el5?.__dispose();
        }

}
