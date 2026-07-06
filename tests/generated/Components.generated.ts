import { Counter } from './Counter.generated';
import { LifecycleTest } from './LifecycleTest.generated';
import { Nested } from './Nested.generated';
import { Todo } from './Todo.generated';
import { UserCard } from './UserCard.generated';

// Soft decorators:
// @Page
// @Route("/components")
// @Title("Components Runtime QA")

export class Components {
    // Components are imported and used in template

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
        private __el6: Counter | null = null;
        private __el10: Todo | null = null;
        private __el14: UserCard | null = null;
        private __el18: Nested | null = null;

    public __render(container: HTMLElement): void {
        // Store container reference for re-renders
        this.__container = container;
        // Cancel any pending render to prevent double-rendering
        this.__renderScheduled = false;

        // Save active element and its selection state
        const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
        const isInContainer = container.contains(activeElement);
        const savedValue = isInContainer && activeElement ? activeElement.value : null;
        const savedSelectionStart = isInContainer && activeElement ? activeElement.selectionStart : null;
        const savedSelectionEnd = isInContainer && activeElement ? activeElement.selectionEnd : null;
        const savedId = isInContainer && activeElement ? activeElement.id || activeElement.getAttribute('data-focus-id') : null;

        container.innerHTML = '';

        const el0 = document.createElement('div');
        el0.setAttribute('class', 'qa-page');
            const el1 = document.createElement('h1');
            const el2 = document.createTextNode('Components Runtime Tests');
        el1.appendChild(el2);
    el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Counter Component');
        el4.appendChild(el5);
    el3.appendChild(el4);
        if (!this.__el6) {
            this.__el6 = new Counter();
        }
        const el6 = this.__el6;
        const el6_container = document.createElement('div');
        // Pass slot content to child
        (el6 as any).__slots = {};
        el6.__render(el6_container);
        el3.appendChild(el6_container);
    el0.appendChild(el3);
        const el7 = document.createElement('div');
        el7.setAttribute('class', 'test-section');
            const el8 = document.createElement('h2');
            const el9 = document.createTextNode('Todo Component');
        el8.appendChild(el9);
    el7.appendChild(el8);
        if (!this.__el10) {
            this.__el10 = new Todo();
        }
        const el10 = this.__el10;
        const el10_container = document.createElement('div');
        // Pass slot content to child
        (el10 as any).__slots = {};
        el10.__render(el10_container);
        el7.appendChild(el10_container);
    el0.appendChild(el7);
        const el11 = document.createElement('div');
        el11.setAttribute('class', 'test-section');
            const el12 = document.createElement('h2');
            const el13 = document.createTextNode('UserCard Component');
        el12.appendChild(el13);
    el11.appendChild(el12);
        if (!this.__el14) {
            this.__el14 = new UserCard();
        }
        const el14 = this.__el14;
        const el14_container = document.createElement('div');
        // Pass slot content to child
        (el14 as any).__slots = {};
        el14.__render(el14_container);
        el11.appendChild(el14_container);
    el0.appendChild(el11);
        const el15 = document.createElement('div');
        el15.setAttribute('class', 'test-section');
            const el16 = document.createElement('h2');
            const el17 = document.createTextNode('Nested Components');
        el16.appendChild(el17);
    el15.appendChild(el16);
        if (!this.__el18) {
            this.__el18 = new Nested();
        }
        const el18 = this.__el18;
        const el18_container = document.createElement('div');
        // Pass slot content to child
        (el18 as any).__slots = {};
        el18.__render(el18_container);
        el15.appendChild(el18_container);
    el0.appendChild(el15);
    container.appendChild(el0);

        // Restore focus to the previously active element
        if (isInContainer && savedId) {
            const elementToFocus = container.querySelector(`[id="${savedId}"], [data-focus-id="${savedId}"]`) as HTMLInputElement | HTMLTextAreaElement;
            if (elementToFocus) {
                elementToFocus.focus();
                if (savedSelectionStart !== null && savedSelectionEnd !== null) {
                    elementToFocus.setSelectionRange(savedSelectionStart, savedSelectionEnd);
                }
            }
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
            this.__el6?.__dispose();
            this.__el10?.__dispose();
            this.__el14?.__dispose();
            this.__el18?.__dispose();
        }

}

// Auto-mount component
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new Components();
        const container = document.querySelector('#app') as HTMLElement;
        if (container) {
            app.__render(container);
        }
    });
}

// Styles
const styles_Components = `
.qa-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 20px 0;
  border-radius: 5px;
}

.test-section h2 {
  margin-top: 0;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles_Components;
    document.head.appendChild(styleEl);
}
