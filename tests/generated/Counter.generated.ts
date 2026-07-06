// Soft decorators:
// @Component
// @Title("Counter")
// @property count = 0

export class Counter {

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

        // Save active element and its selection state
        const activeElement = document.activeElement as HTMLInputElement | HTMLTextAreaElement;
        const isInContainer = container.contains(activeElement);
        const savedValue = isInContainer && activeElement ? activeElement.value : null;
        const savedSelectionStart = isInContainer && activeElement ? activeElement.selectionStart : null;
        const savedSelectionEnd = isInContainer && activeElement ? activeElement.selectionEnd : null;
        const savedId = isInContainer && activeElement ? activeElement.id || activeElement.getAttribute('data-focus-id') : null;

        container.innerHTML = '';

        const el0 = document.createElement('div');
        el0.setAttribute('class', 'counter');
            const el1 = document.createElement('h3');
            const el2 = document.createTextNode('Counter: @count');
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement('button');
        const handler_el3_click = (e) => {
            this.increment();
            queueMicrotask(() => this.__render(container));
        };

        el3.addEventListener('click', handler_el3_click);
        this.__cleanup.push(() => el3.removeEventListener('click', handler_el3_click));
            const el4 = document.createTextNode('+');
        el3.appendChild(el4);
        el0.appendChild(el3);
        const el5 = document.createElement('button');
        const handler_el5_click = (e) => {
            this.decrement();
            queueMicrotask(() => this.__render(container));
        };

        el5.addEventListener('click', handler_el5_click);
        this.__cleanup.push(() => el5.removeEventListener('click', handler_el5_click));
            const el6 = document.createTextNode('-');
        el5.appendChild(el6);
        el0.appendChild(el5);
        const el7 = document.createElement('button');
        const handler_el7_click = (e) => {
            this.reset();
            queueMicrotask(() => this.__render(container));
        };

        el7.addEventListener('click', handler_el7_click);
        this.__cleanup.push(() => el7.removeEventListener('click', handler_el7_click));
            const el8 = document.createTextNode('Reset');
        el7.appendChild(el8);
        el0.appendChild(el7);
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

}

// Styles
const styles_Counter = `
.counter {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.counter h3 {
  margin: 0 0 10px 0;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles_Counter;
    document.head.appendChild(styleEl);
}
