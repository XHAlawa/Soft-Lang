export class App {
onInit() {
  // Check if Runtime is loaded
  if (typeof (window as any).__softRuntime !== 'undefined') {
    document.getElementById('runtime-status').textContent = '✓ Loaded';
    document.getElementById('runtime-status').style.color = 'green';
  } else {
    document.getElementById('runtime-status').textContent = '✗ Not Loaded';
    document.getElementById('runtime-status').style.color = 'red';
  }
  
  // Check if Router is loaded
  if (typeof (window as any).__router !== 'undefined') {
    document.getElementById('router-status').textContent = '✓ Loaded';
    document.getElementById('router-status').style.color = 'green';
  } else {
    document.getElementById('router-status').textContent = '✗ Not Loaded';
    document.getElementById('router-status').style.color = 'red';
  }
  
  // Check if Forms is loaded
  if (typeof (window as any).forms !== 'undefined') {
    document.getElementById('forms-status').textContent = '✓ Loaded';
    document.getElementById('forms-status').style.color = 'green';
  } else {
    document.getElementById('forms-status').textContent = '✗ Not Loaded';
    document.getElementById('forms-status').style.color = 'red';
  }
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
        el0.setAttribute('class', 'qa-nav');
            const el1 = document.createElement('h1');
            const el2 = document.createTextNode('Soft Runtime QA Suite');
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement('nav');
            const el4 = document.createElement('a');
        el4.setAttribute('href', '/');
            const el5 = document.createTextNode('Home');
        el4.appendChild(el5);
        el3.appendChild(el4);
        const el6 = document.createElement('a');
        el6.setAttribute('href', '/forms');
            const el7 = document.createTextNode('Forms');
        el6.appendChild(el7);
        el3.appendChild(el6);
        const el8 = document.createElement('a');
        el8.setAttribute('href', '/router');
            const el9 = document.createTextNode('Router');
        el8.appendChild(el9);
        el3.appendChild(el8);
        const el10 = document.createElement('a');
        el10.setAttribute('href', '/state');
            const el11 = document.createTextNode('State');
        el10.appendChild(el11);
        el3.appendChild(el10);
        const el12 = document.createElement('a');
        el12.setAttribute('href', '/binding');
            const el13 = document.createTextNode('Binding');
        el12.appendChild(el13);
        el3.appendChild(el12);
        const el14 = document.createElement('a');
        el14.setAttribute('href', '/components');
            const el15 = document.createTextNode('Components');
        el14.appendChild(el15);
        el3.appendChild(el14);
        const el16 = document.createElement('a');
        el16.setAttribute('href', '/lifecycle');
            const el17 = document.createTextNode('Lifecycle');
        el16.appendChild(el17);
        el3.appendChild(el16);
        const el18 = document.createElement('a');
        el18.setAttribute('href', '/async');
            const el19 = document.createTextNode('Async');
        el18.appendChild(el19);
        el3.appendChild(el18);
        const el20 = document.createElement('a');
        el20.setAttribute('href', '/session');
            const el21 = document.createTextNode('Session');
        el20.appendChild(el21);
        el3.appendChild(el20);
        const el22 = document.createElement('a');
        el22.setAttribute('href', '/cache');
            const el23 = document.createTextNode('Cache');
        el22.appendChild(el23);
        el3.appendChild(el22);
        el0.appendChild(el3);
        container.appendChild(el0);
        const el24 = document.createElement('div');
        el24.setAttribute('class', 'qa-content');
            const el25 = document.createElement('h2');
            const el26 = document.createTextNode('Runtime QA Test Suite');
        el25.appendChild(el26);
        el24.appendChild(el25);
        const el27 = document.createElement('p');
            const el28 = document.createTextNode('Select a module above to test specific Runtime features.');
        el27.appendChild(el28);
        el24.appendChild(el27);
        const el29 = document.createElement('div');
        el29.setAttribute('class', 'test-status');
            const el30 = document.createElement('h3');
            const el31 = document.createTextNode('Quick Status');
        el30.appendChild(el31);
        el29.appendChild(el30);
        const el32 = document.createElement('ul');
            const el33 = document.createElement('li');
            const el34 = document.createTextNode('Runtime: ');
        el33.appendChild(el34);
        const el35 = document.createElement('span');
        el35.setAttribute('id', 'runtime-status');
            const el36 = document.createTextNode('Loading...');
        el35.appendChild(el36);
        el33.appendChild(el35);
        el32.appendChild(el33);
        const el37 = document.createElement('li');
            const el38 = document.createTextNode('Router: ');
        el37.appendChild(el38);
        const el39 = document.createElement('span');
        el39.setAttribute('id', 'router-status');
            const el40 = document.createTextNode('Loading...');
        el39.appendChild(el40);
        el37.appendChild(el39);
        el32.appendChild(el37);
        const el41 = document.createElement('li');
            const el42 = document.createTextNode('Forms: ');
        el41.appendChild(el42);
        const el43 = document.createElement('span');
        el43.setAttribute('id', 'forms-status');
            const el44 = document.createTextNode('Loading...');
        el43.appendChild(el44);
        el41.appendChild(el43);
        el32.appendChild(el41);
        el29.appendChild(el32);
        el24.appendChild(el29);
        container.appendChild(el24);

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