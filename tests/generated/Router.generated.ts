// Soft decorators:
// @Page
// @Route("/router")
// @Title("Router Runtime QA")
// @property currentRoute = ''
// @property paramsDisplay = '{}'
// @property queryDisplay = '{}'
// @property historyLength = 0
// @property currentPath = ''
// @property stateDisplay = '{}'
// @property currentHash = ''

export class Router {

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
            const el2 = document.createTextNode('Router Runtime Tests');
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Basic Navigation');
        el4.appendChild(el5);
        el3.appendChild(el4);
        const el6 = document.createElement('div');
        el6.setAttribute('class', 'status');
            const el7 = document.createTextNode('Current Route: @currentRoute\r\n    ');
        el6.appendChild(el7);
        el3.appendChild(el6);
        const el8 = document.createElement('button');
        const handler_el8_click = (e) => {
            this.navigateHome();
            queueMicrotask(() => this.__render(container));
        };

        el8.addEventListener('click', handler_el8_click);
        this.__cleanup.push(() => el8.removeEventListener('click', handler_el8_click));
            const el9 = document.createTextNode('Navigate to /');
        el8.appendChild(el9);
        el3.appendChild(el8);
        const el10 = document.createElement('button');
        const handler_el10_click = (e) => {
            this.navigateToRouter();
        };

        el10.addEventListener('click', handler_el10_click);
        this.__cleanup.push(() => el10.removeEventListener('click', handler_el10_click));
            const el11 = document.createTextNode('Navigate to /router');
        el10.appendChild(el11);
        el3.appendChild(el10);
        const el12 = document.createElement('button');
        const handler_el12_click = (e) => {
            this.navigateToState();
        };

        el12.addEventListener('click', handler_el12_click);
        this.__cleanup.push(() => el12.removeEventListener('click', handler_el12_click));
            const el13 = document.createTextNode('Navigate to /state');
        el12.appendChild(el13);
        el3.appendChild(el12);
        el0.appendChild(el3);
        const el14 = document.createElement('div');
        el14.setAttribute('class', 'test-section');
            const el15 = document.createElement('h2');
            const el16 = document.createTextNode('Route Parameters');
        el15.appendChild(el16);
        el14.appendChild(el15);
        const el17 = document.createElement('div');
        el17.setAttribute('class', 'status');
            const el18 = document.createTextNode('Params: @paramsDisplay\r\n    ');
        el17.appendChild(el18);
        el14.appendChild(el17);
        const el19 = document.createElement('button');
        const handler_el19_click = (e) => {
            this.navigateWithId();
            queueMicrotask(() => this.__render(container));
        };

        el19.addEventListener('click', handler_el19_click);
        this.__cleanup.push(() => el19.removeEventListener('click', handler_el19_click));
            const el20 = document.createTextNode('Navigate to /users/123');
        el19.appendChild(el20);
        el14.appendChild(el19);
        const el21 = document.createElement('button');
        const handler_el21_click = (e) => {
            this.navigateWithSlug();
            queueMicrotask(() => this.__render(container));
        };

        el21.addEventListener('click', handler_el21_click);
        this.__cleanup.push(() => el21.removeEventListener('click', handler_el21_click));
            const el22 = document.createTextNode('Navigate to /posts/my-post');
        el21.appendChild(el22);
        el14.appendChild(el21);
        const el23 = document.createElement('button');
        const handler_el23_click = (e) => {
            this.navigateWithMultiple();
            queueMicrotask(() => this.__render(container));
        };

        el23.addEventListener('click', handler_el23_click);
        this.__cleanup.push(() => el23.removeEventListener('click', handler_el23_click));
            const el24 = document.createTextNode('Navigate to /products/123/reviews/456');
        el23.appendChild(el24);
        el14.appendChild(el23);
        el0.appendChild(el14);
        const el25 = document.createElement('div');
        el25.setAttribute('class', 'test-section');
            const el26 = document.createElement('h2');
            const el27 = document.createTextNode('Query Parameters');
        el26.appendChild(el27);
        el25.appendChild(el26);
        const el28 = document.createElement('div');
        el28.setAttribute('class', 'status');
            const el29 = document.createTextNode('Query: @queryDisplay\r\n    ');
        el28.appendChild(el29);
        el25.appendChild(el28);
        const el30 = document.createElement('button');
        const handler_el30_click = (e) => {
            this.navigateWithQuery();
            queueMicrotask(() => this.__render(container));
        };

        el30.addEventListener('click', handler_el30_click);
        this.__cleanup.push(() => el30.removeEventListener('click', handler_el30_click));
            const el31 = document.createTextNode('Navigate with ?page=1&limit=10');
        el30.appendChild(el31);
        el25.appendChild(el30);
        const el32 = document.createElement('button');
        const handler_el32_click = (e) => {
            this.navigateWithArrayQuery();
            queueMicrotask(() => this.__render(container));
        };

        el32.addEventListener('click', handler_el32_click);
        this.__cleanup.push(() => el32.removeEventListener('click', handler_el32_click));
            const el33 = document.createTextNode('Navigate with ?tag=a&tag=b&tag=c');
        el32.appendChild(el33);
        el25.appendChild(el32);
        const el34 = document.createElement('button');
        const handler_el34_click = (e) => {
            this.navigateWithEncoded();
            queueMicrotask(() => this.__render(container));
        };

        el34.addEventListener('click', handler_el34_click);
        this.__cleanup.push(() => el34.removeEventListener('click', handler_el34_click));
            const el35 = document.createTextNode('Navigate with ?search=hello+world');
        el34.appendChild(el35);
        el25.appendChild(el34);
        el0.appendChild(el25);
        const el36 = document.createElement('div');
        el36.setAttribute('class', 'test-section');
            const el37 = document.createElement('h2');
            const el38 = document.createTextNode('Back/Forward Navigation');
        el37.appendChild(el38);
        el36.appendChild(el37);
        const el39 = document.createElement('div');
        el39.setAttribute('class', 'status');
            const el40 = document.createTextNode('History Length: @historyLength\r\n    ');
        el39.appendChild(el40);
        el36.appendChild(el39);
        const el41 = document.createElement('button');
        const handler_el41_click = (e) => {
            this.navigateSeries();
            queueMicrotask(() => this.__render(container));
        };

        el41.addEventListener('click', handler_el41_click);
        this.__cleanup.push(() => el41.removeEventListener('click', handler_el41_click));
            const el42 = document.createTextNode('Navigate Series (3 pages)');
        el41.appendChild(el42);
        el36.appendChild(el41);
        const el43 = document.createElement('button');
        const handler_el43_click = (e) => {
            this.goBack();
            queueMicrotask(() => this.__render(container));
        };

        el43.addEventListener('click', handler_el43_click);
        this.__cleanup.push(() => el43.removeEventListener('click', handler_el43_click));
            const el44 = document.createTextNode('Go Back');
        el43.appendChild(el44);
        el36.appendChild(el43);
        const el45 = document.createElement('button');
        const handler_el45_click = (e) => {
            this.goForward();
            queueMicrotask(() => this.__render(container));
        };

        el45.addEventListener('click', handler_el45_click);
        this.__cleanup.push(() => el45.removeEventListener('click', handler_el45_click));
            const el46 = document.createTextNode('Go Forward');
        el45.appendChild(el46);
        el36.appendChild(el45);
        el0.appendChild(el36);
        const el47 = document.createElement('div');
        el47.setAttribute('class', 'test-section');
            const el48 = document.createElement('h2');
            const el49 = document.createTextNode('Replace Navigation');
        el48.appendChild(el49);
        el47.appendChild(el48);
        const el50 = document.createElement('div');
        el50.setAttribute('class', 'status');
            const el51 = document.createTextNode('Current Path: @currentPath\r\n    ');
        el50.appendChild(el51);
        el47.appendChild(el50);
        const el52 = document.createElement('button');
        const handler_el52_click = (e) => {
            this.replaceNavigation();
            queueMicrotask(() => this.__render(container));
        };

        el52.addEventListener('click', handler_el52_click);
        this.__cleanup.push(() => el52.removeEventListener('click', handler_el52_click));
            const el53 = document.createTextNode('Replace Current Route');
        el52.appendChild(el53);
        el47.appendChild(el52);
        el0.appendChild(el47);
        const el54 = document.createElement('div');
        el54.setAttribute('class', 'test-section');
            const el55 = document.createElement('h2');
            const el56 = document.createTextNode('State Navigation');
        el55.appendChild(el56);
        el54.appendChild(el55);
        const el57 = document.createElement('div');
        el57.setAttribute('class', 'status');
            const el58 = document.createTextNode('State: @stateDisplay\r\n    ');
        el57.appendChild(el58);
        el54.appendChild(el57);
        const el59 = document.createElement('button');
        const handler_el59_click = (e) => {
            this.navigateWithState();
            queueMicrotask(() => this.__render(container));
        };

        el59.addEventListener('click', handler_el59_click);
        this.__cleanup.push(() => el59.removeEventListener('click', handler_el59_click));
            const el60 = document.createTextNode('Navigate with State');
        el59.appendChild(el60);
        el54.appendChild(el59);
        el0.appendChild(el54);
        const el61 = document.createElement('div');
        el61.setAttribute('class', 'test-section');
            const el62 = document.createElement('h2');
            const el63 = document.createTextNode('404 Handling');
        el62.appendChild(el63);
        el61.appendChild(el62);
        const el64 = document.createElement('button');
        const handler_el64_click = (e) => {
            this.navigateTo404();
        };

        el64.addEventListener('click', handler_el64_click);
        this.__cleanup.push(() => el64.removeEventListener('click', handler_el64_click));
            const el65 = document.createTextNode('Navigate to Unknown Route');
        el64.appendChild(el65);
        el61.appendChild(el64);
        el0.appendChild(el61);
        const el66 = document.createElement('div');
        el66.setAttribute('class', 'test-section');
            const el67 = document.createElement('h2');
            const el68 = document.createTextNode('Hash Fragment');
        el67.appendChild(el68);
        el66.appendChild(el67);
        const el69 = document.createElement('div');
        el69.setAttribute('class', 'status');
            const el70 = document.createTextNode('Path: @currentPath | Hash: @currentHash\r\n    ');
        el69.appendChild(el70);
        el66.appendChild(el69);
        const el71 = document.createElement('button');
        const handler_el71_click = (e) => {
            this.navigateWithHash();
            queueMicrotask(() => this.__render(container));
        };

        el71.addEventListener('click', handler_el71_click);
        this.__cleanup.push(() => el71.removeEventListener('click', handler_el71_click));
            const el72 = document.createTextNode('Navigate with #section');
        el71.appendChild(el72);
        el66.appendChild(el71);
        el0.appendChild(el66);
        const el73 = document.createElement('div');
        el73.setAttribute('class', 'test-section');
            const el74 = document.createElement('h2');
            const el75 = document.createTextNode('Refresh Test');
        el74.appendChild(el75);
        el73.appendChild(el74);
        const el76 = document.createElement('button');
        const handler_el76_click = (e) => {
            this.refreshPage();
            queueMicrotask(() => this.__render(container));
        };

        el76.addEventListener('click', handler_el76_click);
        this.__cleanup.push(() => el76.removeEventListener('click', handler_el76_click));
            const el77 = document.createTextNode('Refresh Page');
        el76.appendChild(el77);
        el73.appendChild(el76);
        el0.appendChild(el73);
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
const styles_Router = `
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
  font-family: monospace;
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
    styleEl.textContent = styles_Router;
    document.head.appendChild(styleEl);
}
