// Soft decorators:
// @Component
// @Title("UserCard")
// @property name = 'User'
// @property email = 'user@example.com'

export class UserCard {

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
        el0.setAttribute('class', 'user-card');
            const el1 = document.createElement('div');
        el1.setAttribute('class', 'avatar');
            const el2 = document.createTextNode(String(this.name.charAt(0)));
        el1.appendChild(el2);
        el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'info');
            const el4 = document.createElement('h3');
            const el5 = document.createTextNode(String(this.name));
        el4.appendChild(el5);
        el3.appendChild(el4);
        const el6 = document.createElement('p');
            const el7 = document.createTextNode(String(this.email));
        el6.appendChild(el7);
        el3.appendChild(el6);
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
const styles_UserCard = `
.user-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background: #f8f9fa;
}

.avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: #007bff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: bold;
}

.info h3 {
  margin: 0 0 5px 0;
}

.info p {
  margin: 0;
  color: #666;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles_UserCard;
    document.head.appendChild(styleEl);
}
