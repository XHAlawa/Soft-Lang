// Soft decorators:
// @Page
// @Route("/session")
// @Title("Session Runtime QA")
// @property sessionValue = ''
// @property sessionTimestamp = ''

export class Session {

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
        el0.setAttribute('class', 'qa-page');
            const el1 = document.createElement('h1');
            const el2 = document.createTextNode('Session Runtime Tests');
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Session Storage');
        el4.appendChild(el5);
        el3.appendChild(el4);
        const el6 = document.createElement('div');
        el6.setAttribute('class', 'status');
            const el7 = document.createTextNode('Session Value: @sessionValue\r\n    ');
        el6.appendChild(el7);
        el3.appendChild(el6);
        const el8 = document.createElement('input');
        el8.setAttribute('type', 'text');
        el8.setAttribute('textContent', 'sessionValue');
            el3.appendChild(el8);
        const el9 = document.createElement('button');
        const handler_el9_click = (e) => {
            this.saveSession();
            queueMicrotask(() => this.__render(container));
        };

        el9.addEventListener('click', handler_el9_click);
        this.__cleanup.push(() => el9.removeEventListener('click', handler_el9_click));
            const el10 = document.createTextNode('Save to Session');
        el9.appendChild(el10);
        el3.appendChild(el9);
        const el11 = document.createElement('button');
        const handler_el11_click = (e) => {
            this.loadSession();
            queueMicrotask(() => this.__render(container));
        };

        el11.addEventListener('click', handler_el11_click);
        this.__cleanup.push(() => el11.removeEventListener('click', handler_el11_click));
            const el12 = document.createTextNode('Load from Session');
        el11.appendChild(el12);
        el3.appendChild(el11);
        const el13 = document.createElement('button');
        const handler_el13_click = (e) => {
            this.clearSession();
            queueMicrotask(() => this.__render(container));
        };

        el13.addEventListener('click', handler_el13_click);
        this.__cleanup.push(() => el13.removeEventListener('click', handler_el13_click));
            const el14 = document.createTextNode('Clear Session');
        el13.appendChild(el14);
        el3.appendChild(el13);
        el0.appendChild(el3);
        const el15 = document.createElement('div');
        el15.setAttribute('class', 'test-section');
            const el16 = document.createElement('h2');
            const el17 = document.createTextNode('Session Persistence');
        el16.appendChild(el17);
        el15.appendChild(el16);
        const el18 = document.createElement('div');
        el18.setAttribute('class', 'status');
            const el19 = document.createTextNode('Saved at: @sessionTimestamp\r\n    ');
        el18.appendChild(el19);
        el15.appendChild(el18);
        const el20 = document.createElement('button');
        const handler_el20_click = (e) => {
            this.saveTimestamp();
            queueMicrotask(() => this.__render(container));
        };

        el20.addEventListener('click', handler_el20_click);
        this.__cleanup.push(() => el20.removeEventListener('click', handler_el20_click));
            const el21 = document.createTextNode('Save Timestamp');
        el20.appendChild(el21);
        el15.appendChild(el20);
        const el22 = document.createElement('button');
        const handler_el22_click = (e) => {
            this.refreshAndCheck();
            queueMicrotask(() => this.__render(container));
        };

        el22.addEventListener('click', handler_el22_click);
        this.__cleanup.push(() => el22.removeEventListener('click', handler_el22_click));
            const el23 = document.createTextNode('Refresh and Check');
        el22.appendChild(el23);
        el15.appendChild(el22);
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

}

// Styles
const styles_Session = `
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

.status {
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 3px;
}

input {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 3px;
  margin: 5px;
}

button {
  padding: 10px 20px;
  margin: 5px;
  cursor: pointer;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 3px;
}

button:hover {
  background: #0056b3;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles_Session;
    document.head.appendChild(styleEl);
}
