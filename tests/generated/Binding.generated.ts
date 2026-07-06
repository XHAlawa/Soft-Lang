import { Counter } from './Counter.generated';
import { LifecycleTest } from './LifecycleTest.generated';
import { Nested } from './Nested.generated';
import { Todo } from './Todo.generated';
import { UserCard } from './UserCard.generated';

// Soft decorators:
// @Page
// @Route("/binding")
// @Title("Binding Runtime QA")

export class Binding {

    setBoundValue() {
      this.boundValue = 'programmatic';
    }

    syncInputs() {
      this.multiInput2 = this.multiInput1;
    }

    incrementNumber() {
      this.boundNumber++;
    }

    toggleCheck() {
      this.isChecked = !this.isChecked;
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
            const el2 = document.createTextNode('Binding Runtime Tests');
        el1.appendChild(el2);
    el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Basic Binding');
        el4.appendChild(el5);
    el3.appendChild(el4);
        const el6 = document.createElement('div');
        el6.setAttribute('class', 'status');
            const el7 = document.createTextNode('Bound Value: @boundValue\r\n    ');
        el6.appendChild(el7);
    el3.appendChild(el6);
        const el8 = document.createElement('input');
        el8.setAttribute('type', 'text');
        el8.setAttribute('data-focus-id', 'el8');
        el8.value = String(this.boundValue ?? '');
        el8.addEventListener('input', (e) => {
            this.boundValue = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        el3.appendChild(el8);
        const el9 = document.createElement('button');
        const handler_el9_click = (e) => {
            this.setBoundValue();
            this.__scheduleRender();
        };

        el9.addEventListener('click', handler_el9_click);
        const el10 = document.createTextNode('Set Programmatically');
        el9.appendChild(el10);
        this.__cleanup.push(() => el9.removeEventListener('click', handler_el9_click));
        el3.appendChild(el9);
    el0.appendChild(el3);
        const el11 = document.createElement('div');
        el11.setAttribute('class', 'test-section');
            const el12 = document.createElement('h2');
            const el13 = document.createTextNode('Multiple Inputs');
        el12.appendChild(el13);
    el11.appendChild(el12);
        const el14 = document.createElement('div');
        el14.setAttribute('class', 'status');
            const el15 = document.createTextNode('Input1: @multiInput1 | Input2: @multiInput2\r\n    ');
        el14.appendChild(el15);
    el11.appendChild(el14);
        const el16 = document.createElement('input');
        el16.setAttribute('type', 'text');
        el16.setAttribute('data-focus-id', 'el16');
        el16.value = String(this.multiInput1 ?? '');
        el16.addEventListener('input', (e) => {
            this.multiInput1 = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        el16.setAttribute('placeholder', 'Input 1');
        el11.appendChild(el16);
        const el17 = document.createElement('input');
        el17.setAttribute('type', 'text');
        el17.setAttribute('data-focus-id', 'el17');
        el17.value = String(this.multiInput2 ?? '');
        el17.addEventListener('input', (e) => {
            this.multiInput2 = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        el17.setAttribute('placeholder', 'Input 2');
        el11.appendChild(el17);
        const el18 = document.createElement('button');
        const handler_el18_click = (e) => {
            this.syncInputs();
            this.__scheduleRender();
        };

        el18.addEventListener('click', handler_el18_click);
        const el19 = document.createTextNode('Sync Values');
        el18.appendChild(el19);
        this.__cleanup.push(() => el18.removeEventListener('click', handler_el18_click));
        el11.appendChild(el18);
    el0.appendChild(el11);
        const el20 = document.createElement('div');
        el20.setAttribute('class', 'test-section');
            const el21 = document.createElement('h2');
            const el22 = document.createTextNode('Number Binding');
        el21.appendChild(el22);
    el20.appendChild(el21);
        const el23 = document.createElement('div');
        el23.setAttribute('class', 'status');
            const el24 = document.createTextNode('Number: @boundNumber\r\n    ');
        el23.appendChild(el24);
    el20.appendChild(el23);
        const el25 = document.createElement('input');
        el25.setAttribute('type', 'number');
        el25.setAttribute('data-focus-id', 'el25');
        el25.value = String(this.boundNumber ?? '');
        el25.addEventListener('input', (e) => {
            this.boundNumber = Number((e.target as HTMLInputElement).value);
            this.__scheduleRender();
        });
        el20.appendChild(el25);
        const el26 = document.createElement('button');
        const handler_el26_click = (e) => {
            this.incrementNumber();
            this.__scheduleRender();
        };

        el26.addEventListener('click', handler_el26_click);
        const el27 = document.createTextNode('Increment');
        el26.appendChild(el27);
        this.__cleanup.push(() => el26.removeEventListener('click', handler_el26_click));
        el20.appendChild(el26);
    el0.appendChild(el20);
        const el28 = document.createElement('div');
        el28.setAttribute('class', 'test-section');
            const el29 = document.createElement('h2');
            const el30 = document.createTextNode('Checkbox Binding');
        el29.appendChild(el30);
    el28.appendChild(el29);
        const el31 = document.createElement('div');
        el31.setAttribute('class', 'status');
            const el32 = document.createTextNode('Checked: @isChecked\r\n    ');
        el31.appendChild(el32);
    el28.appendChild(el31);
        const el33 = document.createElement('input');
        el33.setAttribute('type', 'checkbox');
        el33.setAttribute('data-focus-id', 'el33');
        el33.checked = Boolean(this.isChecked);
        el33.addEventListener('change', (e) => {
            this.isChecked = (e.target as HTMLInputElement).checked;
            this.__scheduleRender();
        });
        el28.appendChild(el33);
        const el34 = document.createElement('button');
        const handler_el34_click = (e) => {
            this.toggleCheck();
            this.__scheduleRender();
        };

        el34.addEventListener('click', handler_el34_click);
        const el35 = document.createTextNode('Toggle Programmatically');
        el34.appendChild(el35);
        this.__cleanup.push(() => el34.removeEventListener('click', handler_el34_click));
        el28.appendChild(el34);
    el0.appendChild(el28);
        const el36 = document.createElement('div');
        el36.setAttribute('class', 'test-section');
            const el37 = document.createElement('h2');
            const el38 = document.createTextNode('Select Binding');
        el37.appendChild(el38);
    el36.appendChild(el37);
        const el39 = document.createElement('div');
        el39.setAttribute('class', 'status');
            const el40 = document.createTextNode('Selected: @selectedOption\r\n    ');
        el39.appendChild(el40);
    el36.appendChild(el39);
        const el41 = document.createElement('select');
        el41.setAttribute('data-focus-id', 'el41');
        el41.value = String(this.selectedOption ?? '');
        el41.addEventListener('change', (e) => {
            this.selectedOption = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
            const el42 = document.createElement('option');
        el42.setAttribute('value', 'option1');
            const el43 = document.createTextNode('Option 1');
        el42.appendChild(el43);
    el41.appendChild(el42);
        const el44 = document.createElement('option');
        el44.setAttribute('value', 'option2');
            const el45 = document.createTextNode('Option 2');
        el44.appendChild(el45);
    el41.appendChild(el44);
        const el46 = document.createElement('option');
        el46.setAttribute('value', 'option3');
            const el47 = document.createTextNode('Option 3');
        el46.appendChild(el47);
    el41.appendChild(el46);
    el36.appendChild(el41);
    el0.appendChild(el36);
        const el48 = document.createElement('div');
        el48.setAttribute('class', 'test-section');
            const el49 = document.createElement('h2');
            const el50 = document.createTextNode('Textarea Binding');
        el49.appendChild(el50);
    el48.appendChild(el49);
        const el51 = document.createElement('div');
        el51.setAttribute('class', 'status');
            const el52 = document.createTextNode('Length: @boundText.length\r\n    ');
        el51.appendChild(el52);
    el48.appendChild(el51);
        const el53 = document.createElement('textarea');
        el53.setAttribute('data-focus-id', 'el53');
        el53.value = String(this.boundText ?? '');
        el53.addEventListener('input', (e) => {
            this.boundText = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        el53.setAttribute('rows', '3');
        el48.appendChild(el53);
    el0.appendChild(el48);
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


// Auto-mount component
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new Binding();
        const container = document.querySelector('#app') as HTMLElement;
        if (container) {
            app.__render(container);
        }
    });
}

// Styles
const styles_Binding = `
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

input, select, textarea {
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
    styleEl.textContent = styles_Binding;
    document.head.appendChild(styleEl);
}
