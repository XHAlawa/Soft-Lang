// Soft decorators:
// @Page
// @Route("/state")
// @Title("State Runtime QA")
// @property proxyValue = 'initial'
// @property nestedObject = { user: { name: 'John' } }
// @property arrayItems = ['item1', 'item2', 'item3']
// @property rapidCounter = 0
// @property computedFirst = 'John'
// @property computedLast = 'Doe'

export class State {

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
            const el2 = document.createTextNode('State Runtime Tests');
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Basic Proxy');
        el4.appendChild(el5);
        el3.appendChild(el4);
        const el6 = document.createElement('div');
        el6.setAttribute('class', 'status');
            const el7 = document.createTextNode('Value: @proxyValue\r\n    ');
        el6.appendChild(el7);
        el3.appendChild(el6);
        const el8 = document.createElement('input');
        el8.setAttribute('type', 'text');
        el8.setAttribute('textContent', 'proxyValue');
            el3.appendChild(el8);
        const el9 = document.createElement('button');
        const handler_el9_click = (e) => {
            this.resetProxy();
            queueMicrotask(() => this.__render(container));
        };

        el9.addEventListener('click', handler_el9_click);
        this.__cleanup.push(() => el9.removeEventListener('click', handler_el9_click));
            const el10 = document.createTextNode('Reset');
        el9.appendChild(el10);
        el3.appendChild(el9);
        el0.appendChild(el3);
        const el11 = document.createElement('div');
        el11.setAttribute('class', 'test-section');
            const el12 = document.createElement('h2');
            const el13 = document.createTextNode('Nested Objects');
        el12.appendChild(el13);
        el11.appendChild(el12);
        const el14 = document.createElement('div');
        el14.setAttribute('class', 'status');
            const el15 = document.createTextNode('Nested Value: @nestedObject.user.name\r\n    ');
        el14.appendChild(el15);
        el11.appendChild(el14);
        const el16 = document.createElement('input');
        el16.setAttribute('type', 'text');
        el16.setAttribute('textContent', 'nestedObject.user.name');
            el11.appendChild(el16);
        const el17 = document.createElement('button');
        const handler_el17_click = (e) => {
            this.changeNested();
            queueMicrotask(() => this.__render(container));
        };

        el17.addEventListener('click', handler_el17_click);
        this.__cleanup.push(() => el17.removeEventListener('click', handler_el17_click));
            const el18 = document.createTextNode('Change Nested');
        el17.appendChild(el18);
        el11.appendChild(el17);
        el0.appendChild(el11);
        const el19 = document.createElement('div');
        el19.setAttribute('class', 'test-section');
            const el20 = document.createElement('h2');
            const el21 = document.createTextNode('Arrays');
        el20.appendChild(el21);
        el19.appendChild(el20);
        const el22 = document.createElement('div');
        el22.setAttribute('class', 'status');
            const el23 = document.createTextNode('Array Length: @arrayItems.length\r\n    ');
        el22.appendChild(el23);
        el19.appendChild(el22);
        const el24 = document.createElement('div');
        el24.setAttribute('textContent', 'arrayItems');
            const el25 = document.createElement('div');
            const el26 = document.createTextNode(String(this.item));
        el25.appendChild(el26);
        el24.appendChild(el25);
        const el27 = document.createElement('button');
        const handler_el27_click = (e) => {
            this.addItem();
            queueMicrotask(() => this.__render(container));
        };

        el27.addEventListener('click', handler_el27_click);
        this.__cleanup.push(() => el27.removeEventListener('click', handler_el27_click));
            const el28 = document.createTextNode('Add Item');
        el27.appendChild(el28);
        el24.appendChild(el27);
        const el29 = document.createElement('button');
        const handler_el29_click = (e) => {
            this.removeItem();
            queueMicrotask(() => this.__render(container));
        };

        el29.addEventListener('click', handler_el29_click);
        this.__cleanup.push(() => el29.removeEventListener('click', handler_el29_click));
            const el30 = document.createTextNode('Remove Item');
        el29.appendChild(el30);
        el24.appendChild(el29);
        const el31 = document.createElement('button');
        const handler_el31_click = (e) => {
            this.modifyItem();
            queueMicrotask(() => this.__render(container));
        };

        el31.addEventListener('click', handler_el31_click);
        this.__cleanup.push(() => el31.removeEventListener('click', handler_el31_click));
            const el32 = document.createTextNode('Modify Item');
        el31.appendChild(el32);
        el24.appendChild(el31);
        el19.appendChild(el24);
        const el33 = document.createElement('div');
        el33.setAttribute('class', 'test-section');
            const el34 = document.createElement('h2');
            const el35 = document.createTextNode('Rapid Updates');
        el34.appendChild(el35);
        el33.appendChild(el34);
        const el36 = document.createElement('div');
        el36.setAttribute('class', 'status');
            const el37 = document.createTextNode('Counter: @rapidCounter\r\n    ');
        el36.appendChild(el37);
        el33.appendChild(el36);
        const el38 = document.createElement('button');
        const handler_el38_click = (e) => {
            this.rapidUpdate();
            queueMicrotask(() => this.__render(container));
        };

        el38.addEventListener('click', handler_el38_click);
        this.__cleanup.push(() => el38.removeEventListener('click', handler_el38_click));
            const el39 = document.createTextNode('Rapid Update (100x)');
        el38.appendChild(el39);
        el33.appendChild(el38);
        el19.appendChild(el33);
        const el40 = document.createElement('div');
        el40.setAttribute('class', 'test-section');
            const el41 = document.createElement('h2');
            const el42 = document.createTextNode('Computed State');
        el41.appendChild(el42);
        el40.appendChild(el41);
        const el43 = document.createElement('div');
        el43.setAttribute('class', 'status');
            const el44 = document.createTextNode('First: @computedFirst | Last: @computedLast | Full: @computedFull\r\n    ');
        el43.appendChild(el44);
        el40.appendChild(el43);
        const el45 = document.createElement('input');
        el45.setAttribute('type', 'text');
        el45.setAttribute('textContent', 'computedFirst');
        el45.setAttribute('placeholder', 'First');
            el40.appendChild(el45);
        const el46 = document.createElement('input');
        el46.setAttribute('type', 'text');
        el46.setAttribute('textContent', 'computedLast');
        el46.setAttribute('placeholder', 'Last');
            el40.appendChild(el46);
        el19.appendChild(el40);
        el0.appendChild(el19);
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
const styles_State = `
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
    styleEl.textContent = styles_State;
    document.head.appendChild(styleEl);
}
