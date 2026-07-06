import { Counter } from './Counter.generated';
import { LifecycleTest } from './LifecycleTest.generated';
import { Nested } from './Nested.generated';
import { Todo } from './Todo.generated';
import { UserCard } from './UserCard.generated';

// Soft decorators:
// @Page
// @Route("/cache")
// @Title("Cache Runtime QA")

export class Cache {

    saveCache() {
      localStorage.setItem('cacheValue', this.cacheValue);
    }

    loadCache() {
      this.cacheValue = localStorage.getItem('cacheValue') || '';
    }

    clearCache() {
      localStorage.removeItem('cacheValue');
      this.cacheValue = '';
    }

    saveWithExpiry() {
      const data = {
        value: this.cacheValue,
        expiry: Date.now() + 5000
      };
      localStorage.setItem('cacheWithExpiry', JSON.stringify(data));
      this.cacheExpiry = 5;
    }

    checkExpiry() {
      const cached = localStorage.getItem('cacheWithExpiry');
      if (cached) {
        const data = JSON.parse(cached);
        const remaining = Math.floor((data.expiry - Date.now()) / 1000);
        this.cacheExpiry = remaining > 0 ? remaining : 0;
      }
    }

    saveLargeData() {
      const largeData = 'x'.repeat(1024 * 1024); // 1MB
      localStorage.setItem('largeData', largeData);
      this.cacheSize = largeData.length;
    }

    loadLargeData() {
      const data = localStorage.getItem('largeData');
      this.cacheSize = data ? data.length : 0;
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
            const el2 = document.createTextNode('Cache Runtime Tests');
        el1.appendChild(el2);
    el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Local Storage Cache');
        el4.appendChild(el5);
    el3.appendChild(el4);
        const el6 = document.createElement('div');
        el6.setAttribute('class', 'status');
            const el7 = document.createTextNode('Cache Value: @cacheValue\r\n    ');
        el6.appendChild(el7);
    el3.appendChild(el6);
        const el8 = document.createElement('input');
        el8.setAttribute('type', 'text');
        el8.setAttribute('data-focus-id', 'el8');
        el8.value = String(this.cacheValue ?? '');
        el8.addEventListener('input', (e) => {
            this.cacheValue = (e.target as HTMLInputElement).value;
            this.__scheduleRender();
        });
        el3.appendChild(el8);
        const el9 = document.createElement('button');
        const handler_el9_click = (e) => {
            this.saveCache();
            this.__scheduleRender();
        };

        el9.addEventListener('click', handler_el9_click);
        const el10 = document.createTextNode('Save to Cache');
        el9.appendChild(el10);
        this.__cleanup.push(() => el9.removeEventListener('click', handler_el9_click));
        el3.appendChild(el9);
        const el11 = document.createElement('button');
        const handler_el11_click = (e) => {
            this.loadCache();
            this.__scheduleRender();
        };

        el11.addEventListener('click', handler_el11_click);
        const el12 = document.createTextNode('Load from Cache');
        el11.appendChild(el12);
        this.__cleanup.push(() => el11.removeEventListener('click', handler_el11_click));
        el3.appendChild(el11);
        const el13 = document.createElement('button');
        const handler_el13_click = (e) => {
            this.clearCache();
            this.__scheduleRender();
        };

        el13.addEventListener('click', handler_el13_click);
        const el14 = document.createTextNode('Clear Cache');
        el13.appendChild(el14);
        this.__cleanup.push(() => el13.removeEventListener('click', handler_el13_click));
        el3.appendChild(el13);
    el0.appendChild(el3);
        const el15 = document.createElement('div');
        el15.setAttribute('class', 'test-section');
            const el16 = document.createElement('h2');
            const el17 = document.createTextNode('Cache Expiration');
        el16.appendChild(el17);
    el15.appendChild(el16);
        const el18 = document.createElement('div');
        el18.setAttribute('class', 'status');
            const el19 = document.createTextNode('Expires in: @cacheExpiry seconds\r\n    ');
        el18.appendChild(el19);
    el15.appendChild(el18);
        const el20 = document.createElement('button');
        const handler_el20_click = (e) => {
            this.saveWithExpiry();
            this.__scheduleRender();
        };

        el20.addEventListener('click', handler_el20_click);
        const el21 = document.createTextNode('Save with 5s Expiry');
        el20.appendChild(el21);
        this.__cleanup.push(() => el20.removeEventListener('click', handler_el20_click));
        el15.appendChild(el20);
        const el22 = document.createElement('button');
        const handler_el22_click = (e) => {
            this.checkExpiry();
            this.__scheduleRender();
        };

        el22.addEventListener('click', handler_el22_click);
        const el23 = document.createTextNode('Check Expiry');
        el22.appendChild(el23);
        this.__cleanup.push(() => el22.removeEventListener('click', handler_el22_click));
        el15.appendChild(el22);
    el0.appendChild(el15);
        const el24 = document.createElement('div');
        el24.setAttribute('class', 'test-section');
            const el25 = document.createElement('h2');
            const el26 = document.createTextNode('Large Cache Data');
        el25.appendChild(el26);
    el24.appendChild(el25);
        const el27 = document.createElement('div');
        el27.setAttribute('class', 'status');
            const el28 = document.createTextNode('Size: @cacheSize bytes\r\n    ');
        el27.appendChild(el28);
    el24.appendChild(el27);
        const el29 = document.createElement('button');
        const handler_el29_click = (e) => {
            this.saveLargeData();
            this.__scheduleRender();
        };

        el29.addEventListener('click', handler_el29_click);
        const el30 = document.createTextNode('Save Large Data (1MB)');
        el29.appendChild(el30);
        this.__cleanup.push(() => el29.removeEventListener('click', handler_el29_click));
        el24.appendChild(el29);
        const el31 = document.createElement('button');
        const handler_el31_click = (e) => {
            this.loadLargeData();
            this.__scheduleRender();
        };

        el31.addEventListener('click', handler_el31_click);
        const el32 = document.createTextNode('Load Large Data');
        el31.appendChild(el32);
        this.__cleanup.push(() => el31.removeEventListener('click', handler_el31_click));
        el24.appendChild(el31);
    el0.appendChild(el24);
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
        const app = new Cache();
        const container = document.querySelector('#app') as HTMLElement;
        if (container) {
            app.__render(container);
        }
    });
}

// Styles
const styles_Cache = `
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
    styleEl.textContent = styles_Cache;
    document.head.appendChild(styleEl);
}
