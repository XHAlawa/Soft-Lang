import { Counter } from './Counter.generated';
import { LifecycleTest } from './LifecycleTest.generated';
import { Nested } from './Nested.generated';
import { Todo } from './Todo.generated';
import { UserCard } from './UserCard.generated';

// Soft decorators:
// @Page
// @Route("/async")
// @Title("Async Runtime QA")

export class Async {

    async loadAsyncData() {
      this.asyncStatus = 'Loading...';
      await new Promise(r => setTimeout(r, 1000));
      this.asyncData = 'Loaded data at ' + new Date().toISOString();
      this.asyncStatus = 'Complete';
    }

    async fireRapidAsync() {
      this.asyncCompleted = 0;
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(
          new Promise(r => setTimeout(() => {
            this.asyncCompleted++;
            r(null);
          }, Math.random() * 500))
        );
      }
      await Promise.all(promises);
    }

    async triggerAsyncError() {
      try {
        await new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Async error')), 500);
        });
      } catch (e) {
        this.asyncError = (e as Error).message;
      }
    }

    async triggerRace() {
      this.raceWinner = 'Racing...';
      const promises = [
        new Promise(r => setTimeout(() => r('Request 1'), 1000)),
        new Promise(r => setTimeout(() => r('Request 2'), 500)),
        new Promise(r => setTimeout(() => r('Request 3'), 1500))
      ];
      this.raceWinner = await Promise.race(promises);
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
            const el2 = document.createTextNode('Async Runtime Tests');
        el1.appendChild(el2);
    el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Async Data Loading');
        el4.appendChild(el5);
    el3.appendChild(el4);
        const el6 = document.createElement('div');
        el6.setAttribute('class', 'status');
            const el7 = document.createTextNode('Status: @asyncStatus\r\n    ');
        el6.appendChild(el7);
    el3.appendChild(el6);
        const el8 = document.createElement('div');
        el8.style.display = (this.asyncData) ? '' : 'none';
            const el9 = document.createElement('div');
            const el10 = document.createTextNode('Data: @asyncData');
        el9.appendChild(el10);
    el8.appendChild(el9);
    el3.appendChild(el8);
        const el11 = document.createElement('button');
        const handler_el11_click = (e) => {
            this.loadAsyncData();
            this.__scheduleRender();
        };

        el11.addEventListener('click', handler_el11_click);
        const el12 = document.createTextNode('Load Data');
        el11.appendChild(el12);
        this.__cleanup.push(() => el11.removeEventListener('click', handler_el11_click));
        el3.appendChild(el11);
    el0.appendChild(el3);
        const el13 = document.createElement('div');
        el13.setAttribute('class', 'test-section');
            const el14 = document.createElement('h2');
            const el15 = document.createTextNode('Rapid Async Requests');
        el14.appendChild(el15);
    el13.appendChild(el14);
        const el16 = document.createElement('div');
        el16.setAttribute('class', 'status');
            const el17 = document.createTextNode('Completed: @asyncCompleted / @asyncTotal\r\n    ');
        el16.appendChild(el17);
    el13.appendChild(el16);
        const el18 = document.createElement('button');
        const handler_el18_click = (e) => {
            this.fireRapidAsync();
            this.__scheduleRender();
        };

        el18.addEventListener('click', handler_el18_click);
        const el19 = document.createTextNode('Fire 10 Rapid Requests');
        el18.appendChild(el19);
        this.__cleanup.push(() => el18.removeEventListener('click', handler_el18_click));
        el13.appendChild(el18);
    el0.appendChild(el13);
        const el20 = document.createElement('div');
        el20.setAttribute('class', 'test-section');
            const el21 = document.createElement('h2');
            const el22 = document.createTextNode('Async Error Handling');
        el21.appendChild(el22);
    el20.appendChild(el21);
        const el23 = document.createElement('div');
        el23.setAttribute('class', 'status');
            const el24 = document.createTextNode('Error: @asyncError\r\n    ');
        el23.appendChild(el24);
    el20.appendChild(el23);
        const el25 = document.createElement('button');
        const handler_el25_click = (e) => {
            this.triggerAsyncError();
            this.__scheduleRender();
        };

        el25.addEventListener('click', handler_el25_click);
        const el26 = document.createTextNode('Trigger Error');
        el25.appendChild(el26);
        this.__cleanup.push(() => el25.removeEventListener('click', handler_el25_click));
        el20.appendChild(el25);
    el0.appendChild(el20);
        const el27 = document.createElement('div');
        el27.setAttribute('class', 'test-section');
            const el28 = document.createElement('h2');
            const el29 = document.createTextNode('Async Race Condition');
        el28.appendChild(el29);
    el27.appendChild(el28);
        const el30 = document.createElement('div');
        el30.setAttribute('class', 'status');
            const el31 = document.createTextNode('Winner: @raceWinner\r\n    ');
        el30.appendChild(el31);
    el27.appendChild(el30);
        const el32 = document.createElement('button');
        const handler_el32_click = (e) => {
            this.triggerRace();
            this.__scheduleRender();
        };

        el32.addEventListener('click', handler_el32_click);
        const el33 = document.createTextNode('Trigger Race');
        el32.appendChild(el33);
        this.__cleanup.push(() => el32.removeEventListener('click', handler_el32_click));
        el27.appendChild(el32);
    el0.appendChild(el27);
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
        const app = new Async();
        const container = document.querySelector('#app') as HTMLElement;
        if (container) {
            app.__render(container);
        }
    });
}

// Styles
const styles_Async = `
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
    styleEl.textContent = styles_Async;
    document.head.appendChild(styleEl);
}
