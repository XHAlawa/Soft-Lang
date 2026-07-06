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

export class LifecycleTest {
    mountedCount = 0;
    updatedCount = 0;
    destroyedCount = 0;

    onMounted() {
      this.mountedCount++;
      console.log('Component mounted');
      const el = document.getElementById('mounted-status');
      if (el) el.textContent = 'Yes';
    }

    onUpdated() {
      this.updatedCount++;
      console.log('Component updated');
      const el = document.getElementById('updated-count');
      if (el) el.textContent = String(this.updatedCount);
    }

    onDestroy() {
      this.destroyedCount++;
      console.log('Component destroyed');
      const el = document.getElementById('destroyed-status');
      if (el) el.textContent = 'Yes';
    }

    triggerUpdate() {
      // Force re-render
      queueMicrotask(() => this.__render(this.__container));
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
                        const el2 = document.createTextNode('Lifecycle Hooks Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Lifecycle Hooks Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
        }
        let el3: HTMLParagraphElement;
        if (isFirstRender) {
            el3 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el3 = container.children[2] as HTMLParagraphElement;
            if (!el3 || el3.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el3 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[2]) {
                    container.replaceChild(el3, container.children[2]);
                } else {
                        const el4 = document.createTextNode('Mounted: ');
        if (isFirstRender) {
            container.appendChild(el4);
        }
        let el5: HTMLSpanElement;
        if (isFirstRender) {
            el5 = document.createElement('span') as HTMLSpanElement;
        } else {
            el5 = container.children[4] as HTMLSpanElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el5 = document.createElement('span') as HTMLSpanElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        el5.setAttribute('id', 'mounted-status');
        if (isFirstRender) {
                const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
    container.appendChild(el3);
                }
            }
        }

        if (isFirstRender) {
                const el4 = document.createTextNode('Mounted: ');
        if (isFirstRender) {
            container.appendChild(el4);
        }
        let el5: HTMLSpanElement;
        if (isFirstRender) {
            el5 = document.createElement('span') as HTMLSpanElement;
        } else {
            el5 = container.children[4] as HTMLSpanElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el5 = document.createElement('span') as HTMLSpanElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        el5.setAttribute('id', 'mounted-status');
        if (isFirstRender) {
                const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
    container.appendChild(el3);
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
                        const el8 = document.createTextNode('Updated: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLSpanElement;
        if (isFirstRender) {
            el9 = document.createElement('span') as HTMLSpanElement;
        } else {
            el9 = container.children[8] as HTMLSpanElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el9 = document.createElement('span') as HTMLSpanElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('id', 'updated-count');
        if (isFirstRender) {
                const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
    container.appendChild(el7);
                }
            }
        }

        if (isFirstRender) {
                const el8 = document.createTextNode('Updated: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLSpanElement;
        if (isFirstRender) {
            el9 = document.createElement('span') as HTMLSpanElement;
        } else {
            el9 = container.children[8] as HTMLSpanElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el9 = document.createElement('span') as HTMLSpanElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('id', 'updated-count');
        if (isFirstRender) {
                const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
    container.appendChild(el7);
        }
        let el11: HTMLParagraphElement;
        if (isFirstRender) {
            el11 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el11 = container.children[10] as HTMLParagraphElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el11 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                        const el12 = document.createTextNode('Destroyed: ');
        if (isFirstRender) {
            container.appendChild(el12);
        }
        let el13: HTMLSpanElement;
        if (isFirstRender) {
            el13 = document.createElement('span') as HTMLSpanElement;
        } else {
            el13 = container.children[12] as HTMLSpanElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el13 = document.createElement('span') as HTMLSpanElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        el13.setAttribute('id', 'destroyed-status');
        if (isFirstRender) {
                const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
    container.appendChild(el11);
                }
            }
        }

        if (isFirstRender) {
                const el12 = document.createTextNode('Destroyed: ');
        if (isFirstRender) {
            container.appendChild(el12);
        }
        let el13: HTMLSpanElement;
        if (isFirstRender) {
            el13 = document.createElement('span') as HTMLSpanElement;
        } else {
            el13 = container.children[12] as HTMLSpanElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el13 = document.createElement('span') as HTMLSpanElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        el13.setAttribute('id', 'destroyed-status');
        if (isFirstRender) {
                const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
    container.appendChild(el11);
        }
        let el15: HTMLButtonElement;
        if (isFirstRender) {
            el15 = document.createElement('button') as HTMLButtonElement;
        } else {
            el15 = container.children[14] as HTMLButtonElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el15 = document.createElement('button') as HTMLButtonElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        const handler_el15_click = (e) => {
            this.triggerUpdate();
            this.__scheduleRender();
        };

        el15.addEventListener('click', handler_el15_click);
        const el16 = document.createTextNode('Trigger Update');
        if (isFirstRender) {
            container.appendChild(el16);
        }
        this.__cleanup.push(() => el15.removeEventListener('click', handler_el15_click));
        if (isFirstRender) {
            container.appendChild(el15);
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
                        const el2 = document.createTextNode('Lifecycle Hooks Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
                }
            }
        }

        if (isFirstRender) {
                const el2 = document.createTextNode('Lifecycle Hooks Test');
        if (isFirstRender) {
            container.appendChild(el2);
        }
    container.appendChild(el1);
        }
        let el3: HTMLParagraphElement;
        if (isFirstRender) {
            el3 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el3 = container.children[2] as HTMLParagraphElement;
            if (!el3 || el3.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el3 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[2]) {
                    container.replaceChild(el3, container.children[2]);
                } else {
                        const el4 = document.createTextNode('Mounted: ');
        if (isFirstRender) {
            container.appendChild(el4);
        }
        let el5: HTMLSpanElement;
        if (isFirstRender) {
            el5 = document.createElement('span') as HTMLSpanElement;
        } else {
            el5 = container.children[4] as HTMLSpanElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el5 = document.createElement('span') as HTMLSpanElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        el5.setAttribute('id', 'mounted-status');
        if (isFirstRender) {
                const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
    container.appendChild(el3);
                }
            }
        }

        if (isFirstRender) {
                const el4 = document.createTextNode('Mounted: ');
        if (isFirstRender) {
            container.appendChild(el4);
        }
        let el5: HTMLSpanElement;
        if (isFirstRender) {
            el5 = document.createElement('span') as HTMLSpanElement;
        } else {
            el5 = container.children[4] as HTMLSpanElement;
            if (!el5 || el5.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el5 = document.createElement('span') as HTMLSpanElement;
                if (container.children[4]) {
                    container.replaceChild(el5, container.children[4]);
                } else {
                        const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
                }
            }
        }

        el5.setAttribute('id', 'mounted-status');
        if (isFirstRender) {
                const el6 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el6);
        }
    container.appendChild(el5);
        }
    container.appendChild(el3);
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
                        const el8 = document.createTextNode('Updated: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLSpanElement;
        if (isFirstRender) {
            el9 = document.createElement('span') as HTMLSpanElement;
        } else {
            el9 = container.children[8] as HTMLSpanElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el9 = document.createElement('span') as HTMLSpanElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('id', 'updated-count');
        if (isFirstRender) {
                const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
    container.appendChild(el7);
                }
            }
        }

        if (isFirstRender) {
                const el8 = document.createTextNode('Updated: ');
        if (isFirstRender) {
            container.appendChild(el8);
        }
        let el9: HTMLSpanElement;
        if (isFirstRender) {
            el9 = document.createElement('span') as HTMLSpanElement;
        } else {
            el9 = container.children[8] as HTMLSpanElement;
            if (!el9 || el9.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el9 = document.createElement('span') as HTMLSpanElement;
                if (container.children[8]) {
                    container.replaceChild(el9, container.children[8]);
                } else {
                        const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
                }
            }
        }

        el9.setAttribute('id', 'updated-count');
        if (isFirstRender) {
                const el10 = document.createTextNode('0');
        if (isFirstRender) {
            container.appendChild(el10);
        }
    container.appendChild(el9);
        }
    container.appendChild(el7);
        }
        let el11: HTMLParagraphElement;
        if (isFirstRender) {
            el11 = document.createElement('p') as HTMLParagraphElement;
        } else {
            el11 = container.children[10] as HTMLParagraphElement;
            if (!el11 || el11.tagName.toLowerCase() !== 'p') {
                // Structure changed, rebuild this element
                el11 = document.createElement('p') as HTMLParagraphElement;
                if (container.children[10]) {
                    container.replaceChild(el11, container.children[10]);
                } else {
                        const el12 = document.createTextNode('Destroyed: ');
        if (isFirstRender) {
            container.appendChild(el12);
        }
        let el13: HTMLSpanElement;
        if (isFirstRender) {
            el13 = document.createElement('span') as HTMLSpanElement;
        } else {
            el13 = container.children[12] as HTMLSpanElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el13 = document.createElement('span') as HTMLSpanElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        el13.setAttribute('id', 'destroyed-status');
        if (isFirstRender) {
                const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
    container.appendChild(el11);
                }
            }
        }

        if (isFirstRender) {
                const el12 = document.createTextNode('Destroyed: ');
        if (isFirstRender) {
            container.appendChild(el12);
        }
        let el13: HTMLSpanElement;
        if (isFirstRender) {
            el13 = document.createElement('span') as HTMLSpanElement;
        } else {
            el13 = container.children[12] as HTMLSpanElement;
            if (!el13 || el13.tagName.toLowerCase() !== 'span') {
                // Structure changed, rebuild this element
                el13 = document.createElement('span') as HTMLSpanElement;
                if (container.children[12]) {
                    container.replaceChild(el13, container.children[12]);
                } else {
                        const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
                }
            }
        }

        el13.setAttribute('id', 'destroyed-status');
        if (isFirstRender) {
                const el14 = document.createTextNode('No');
        if (isFirstRender) {
            container.appendChild(el14);
        }
    container.appendChild(el13);
        }
    container.appendChild(el11);
        }
        let el15: HTMLButtonElement;
        if (isFirstRender) {
            el15 = document.createElement('button') as HTMLButtonElement;
        } else {
            el15 = container.children[14] as HTMLButtonElement;
            if (!el15 || el15.tagName.toLowerCase() !== 'button') {
                // Structure changed, rebuild this element
                el15 = document.createElement('button') as HTMLButtonElement;
                if (container.children[14]) {
                    container.replaceChild(el15, container.children[14]);
                } else {
                    container.appendChild(el15);
                }
            }
        }

        const handler_el15_click = (e) => {
            this.triggerUpdate();
            this.__scheduleRender();
        };

        el15.addEventListener('click', handler_el15_click);
        const el16 = document.createTextNode('Trigger Update');
        if (isFirstRender) {
            container.appendChild(el16);
        }
        this.__cleanup.push(() => el15.removeEventListener('click', handler_el15_click));
        if (isFirstRender) {
            container.appendChild(el15);
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
