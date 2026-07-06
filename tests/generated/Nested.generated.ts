// Soft decorators:
// @Component
// @Title("Nested")
// @property parentValue = 'parent'

export class Nested {

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
        el0.setAttribute('class', 'nested');
            const el1 = document.createElement('h3');
            const el2 = document.createTextNode('Nested Components');
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'parent');
            const el4 = document.createElement('p');
            const el5 = document.createTextNode('Parent Value: @parentValue');
        el4.appendChild(el5);
        el3.appendChild(el4);
        const el6 = document.createElement('button');
        const handler_el6_click = (e) => {
            this.changeParent();
            queueMicrotask(() => this.__render(container));
        };

        el6.addEventListener('click', handler_el6_click);
        this.__cleanup.push(() => el6.removeEventListener('click', handler_el6_click));
            const el7 = document.createTextNode('Change Parent');
        el6.appendChild(el7);
        el3.appendChild(el6);
        const el8 = document.createElement('div');
        el8.setAttribute('class', 'child');
            const el9 = document.createElement('Counter');
            el8.appendChild(el9);
        el3.appendChild(el8);
        el0.appendChild(el3);
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
const styles_Nested = `
.nested {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
}

.parent {
  padding: 15px;
  background: #f8f9fa;
  border-radius: 5px;
}

.child {
  margin-top: 15px;
  padding: 15px;
  background: #e9ecef;
  border-radius: 5px;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles_Nested;
    document.head.appendChild(styleEl);
}
