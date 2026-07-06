import { Counter } from './Counter.generated';
import { LifecycleTest } from './LifecycleTest.generated';
import { Nested } from './Nested.generated';
import { Todo } from './Todo.generated';
import { UserCard } from './UserCard.generated';

// Soft decorators:
// @Page
// @Route("/forms")
// @Title("Forms Runtime QA")

export class Forms {
      username: ''
    
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
            const el2 = document.createTextNode('Forms Runtime Tests');
        el1.appendChild(el2);
    el0.appendChild(el1);
        const el3 = document.createElement('div');
        el3.setAttribute('class', 'test-section');
            const el4 = document.createElement('h2');
            const el5 = document.createTextNode('Required Validation');
        el4.appendChild(el5);
    el3.appendChild(el4);
        const el6 = document.createElement('form');
        el6.setAttribute('textContent', 'requiredForm');
            const el7 = document.createElement('label');
            const el8 = document.createTextNode('Username (required):');
        el7.appendChild(el8);
    el6.appendChild(el7);
        const el9 = document.createElement('input');
        el9.setAttribute('type', 'text');
        el9.setAttribute('textContent', 'username');
        el6.appendChild(el9);
        const el10 = document.createElement('div');
        el10.setAttribute('class', 'error');
        el10.style.display = () ? '' : 'none';
            const __new_requiredForm_username_$errors_map = new Map<any, any>();
        (this.requiredForm.username.$errors || []).forEach((item, index) => {
            const el11 = document.createTextNode(' error ->\r\n          ');
            el10.appendChild(el11);
            const el12 = document.createElement('div');
                    const el13 = document.createTextNode('@error.message');
            el12.appendChild(el13);
    el10.appendChild(el12);
        });
    el6.appendChild(el10);
        const el14 = document.createElement('div');
        el14.setAttribute('class', 'status');
            const el15 = document.createTextNode('Dirty: @requiredForm.username.$dirty | \r\n        Touched: @requiredForm.username.$touched | \r\n        Valid: @requiredForm.username.$valid\r\n      ');
        el14.appendChild(el15);
    el6.appendChild(el14);
        const el16 = document.createElement('button');
        el16.setAttribute('type', 'button');
        const handler_el16_click = (e) => {
            this.validateRequired();
            this.__scheduleRender();
        };

        el16.addEventListener('click', handler_el16_click);
        const el17 = document.createTextNode('Validate');
        el16.appendChild(el17);
        this.__cleanup.push(() => el16.removeEventListener('click', handler_el16_click));
        el6.appendChild(el16);
        const el18 = document.createElement('button');
        el18.setAttribute('type', 'button');
        const handler_el18_click = (e) => {
            this.resetRequired();
            this.__scheduleRender();
        };

        el18.addEventListener('click', handler_el18_click);
        const el19 = document.createTextNode('Reset');
        el18.appendChild(el19);
        this.__cleanup.push(() => el18.removeEventListener('click', handler_el18_click));
        el6.appendChild(el18);
    el3.appendChild(el6);
    el0.appendChild(el3);
        const el20 = document.createElement('div');
        el20.setAttribute('class', 'test-section');
            const el21 = document.createElement('h2');
            const el22 = document.createTextNode('Email Validation');
        el21.appendChild(el22);
    el20.appendChild(el21);
        const el23 = document.createElement('form');
        el23.setAttribute('textContent', 'emailForm');
            const el24 = document.createElement('label');
            const el25 = document.createTextNode('Email:');
        el24.appendChild(el25);
    el23.appendChild(el24);
        const el26 = document.createElement('input');
        el26.setAttribute('type', 'email');
        el26.setAttribute('textContent', 'email');
        el23.appendChild(el26);
        const el27 = document.createElement('div');
        el27.setAttribute('class', 'error');
        el27.style.display = () ? '' : 'none';
            const __new_emailForm_email_$errors_map = new Map<any, any>();
        (this.emailForm.email.$errors || []).forEach((item, index) => {
            const el28 = document.createTextNode(' error ->\r\n          ');
            el27.appendChild(el28);
            const el29 = document.createElement('div');
                    const el30 = document.createTextNode('@error.message');
            el29.appendChild(el30);
    el27.appendChild(el29);
        });
    el23.appendChild(el27);
        const el31 = document.createElement('div');
        el31.setAttribute('class', 'status');
            const el32 = document.createTextNode('Dirty: @emailForm.email.$dirty | \r\n        Touched: @emailForm.email.$touched | \r\n        Valid: @emailForm.email.$valid\r\n      ');
        el31.appendChild(el32);
    el23.appendChild(el31);
        const el33 = document.createElement('button');
        el33.setAttribute('type', 'button');
        const handler_el33_click = (e) => {
            this.validateEmail();
            this.__scheduleRender();
        };

        el33.addEventListener('click', handler_el33_click);
        const el34 = document.createTextNode('Validate');
        el33.appendChild(el34);
        this.__cleanup.push(() => el33.removeEventListener('click', handler_el33_click));
        el23.appendChild(el33);
    el20.appendChild(el23);
    el0.appendChild(el20);
        const el35 = document.createElement('div');
        el35.setAttribute('class', 'test-section');
            const el36 = document.createElement('h2');
            const el37 = document.createTextNode('Async Validation');
        el36.appendChild(el37);
    el35.appendChild(el36);
        const el38 = document.createElement('form');
        el38.setAttribute('textContent', 'asyncForm');
            const el39 = document.createElement('label');
            const el40 = document.createTextNode('Username (async check):');
        el39.appendChild(el40);
    el38.appendChild(el39);
        const el41 = document.createElement('input');
        el41.setAttribute('type', 'text');
        el41.setAttribute('textContent', 'username');
        el38.appendChild(el41);
        const el42 = document.createElement('div');
        el42.setAttribute('class', 'pending');
        el42.style.display = () ? '' : 'none';
            const el43 = document.createTextNode('Checking availability...');
        el42.appendChild(el43);
    el38.appendChild(el42);
        const el44 = document.createElement('div');
        el44.setAttribute('class', 'error');
        el44.style.display = () ? '' : 'none';
            const __new_asyncForm_username_$errors_map = new Map<any, any>();
        (this.asyncForm.username.$errors || []).forEach((item, index) => {
            const el45 = document.createTextNode(' error ->\r\n          ');
            el44.appendChild(el45);
            const el46 = document.createElement('div');
                    const el47 = document.createTextNode('@error.message');
            el46.appendChild(el47);
    el44.appendChild(el46);
        });
    el38.appendChild(el44);
        const el48 = document.createElement('div');
        el48.setAttribute('class', 'status');
            const el49 = document.createTextNode('Pending: @asyncForm.username.$pending | \r\n        Valid: @asyncForm.username.$valid\r\n      ');
        el48.appendChild(el49);
    el38.appendChild(el48);
        const el50 = document.createElement('button');
        el50.setAttribute('type', 'button');
        const handler_el50_click = (e) => {
            this.validateAsync();
            this.__scheduleRender();
        };

        el50.addEventListener('click', handler_el50_click);
        const el51 = document.createTextNode('Validate Async');
        el50.appendChild(el51);
        this.__cleanup.push(() => el50.removeEventListener('click', handler_el50_click));
        el38.appendChild(el50);
    el35.appendChild(el38);
    el0.appendChild(el35);
        const el52 = document.createElement('div');
        el52.setAttribute('class', 'test-section');
            const el53 = document.createElement('h2');
            const el54 = document.createTextNode('Blur Trigger');
        el53.appendChild(el54);
    el52.appendChild(el53);
        const el55 = document.createElement('form');
        el55.setAttribute('textContent', 'blurForm');
            const el56 = document.createElement('label');
            const el57 = document.createTextNode('Field (validates on blur):');
        el56.appendChild(el57);
    el55.appendChild(el56);
        const el58 = document.createElement('input');
        el58.setAttribute('type', 'text');
        el58.setAttribute('textContent', 'value');
        el55.appendChild(el58);
        const el59 = document.createElement('div');
        el59.setAttribute('class', 'error');
        el59.style.display = () ? '' : 'none';
            const __new_blurForm_value_$errors_map = new Map<any, any>();
        (this.blurForm.value.$errors || []).forEach((item, index) => {
            const el60 = document.createTextNode(' error ->\r\n          ');
            el59.appendChild(el60);
            const el61 = document.createElement('div');
                    const el62 = document.createTextNode('@error.message');
            el61.appendChild(el62);
    el59.appendChild(el61);
        });
    el55.appendChild(el59);
        const el63 = document.createElement('div');
        el63.setAttribute('class', 'status');
            const el64 = document.createTextNode('Touched: @blurForm.value.$touched | \r\n        Focused: @blurForm.value.$focused\r\n      ');
        el63.appendChild(el64);
    el55.appendChild(el63);
    el52.appendChild(el55);
    el0.appendChild(el52);
        const el65 = document.createElement('div');
        el65.setAttribute('class', 'test-section');
            const el66 = document.createElement('h2');
            const el67 = document.createTextNode('Submit Validation');
        el66.appendChild(el67);
    el65.appendChild(el66);
        const el68 = document.createElement('form');
        el68.setAttribute('textContent', 'submitForm');
            const el69 = document.createElement('label');
            const el70 = document.createTextNode('Name:');
        el69.appendChild(el70);
    el68.appendChild(el69);
        const el71 = document.createElement('input');
        el71.setAttribute('type', 'text');
        el71.setAttribute('textContent', 'name');
        el68.appendChild(el71);
        const el72 = document.createElement('div');
        el72.setAttribute('class', 'error');
        el72.style.display = () ? '' : 'none';
            const __new_submitForm_name_$errors_map = new Map<any, any>();
        (this.submitForm.name.$errors || []).forEach((item, index) => {
            const el73 = document.createTextNode(' error ->\r\n          ');
            el72.appendChild(el73);
            const el74 = document.createElement('div');
                    const el75 = document.createTextNode('@error.message');
            el74.appendChild(el75);
    el72.appendChild(el74);
        });
    el68.appendChild(el72);
        const el76 = document.createElement('label');
            const el77 = document.createTextNode('Email:');
        el76.appendChild(el77);
    el68.appendChild(el76);
        const el78 = document.createElement('input');
        el78.setAttribute('type', 'email');
        el78.setAttribute('textContent', 'email');
        el68.appendChild(el78);
        const el79 = document.createElement('div');
        el79.setAttribute('class', 'error');
        el79.style.display = () ? '' : 'none';
            const __new_submitForm_email_$errors_map = new Map<any, any>();
        (this.submitForm.email.$errors || []).forEach((item, index) => {
            const el80 = document.createTextNode(' error ->\r\n          ');
            el79.appendChild(el80);
            const el81 = document.createElement('div');
                    const el82 = document.createTextNode('@error.message');
            el81.appendChild(el82);
    el79.appendChild(el81);
        });
    el68.appendChild(el79);
        const el83 = document.createElement('div');
        el83.setAttribute('class', 'status');
            const el84 = document.createTextNode('Form Valid: @submitForm.$valid | \r\n        Form Dirty: @submitForm.$dirty | \r\n        Submitting: @submitForm.$submitting\r\n      ');
        el83.appendChild(el84);
    el68.appendChild(el83);
        const el85 = document.createElement('button');
        el85.setAttribute('type', 'button');
        const handler_el85_click = (e) => {
            this.submitFormTest();
            this.__scheduleRender();
        };

        el85.addEventListener('click', handler_el85_click);
        const el86 = document.createTextNode('Submit');
        el85.appendChild(el86);
        this.__cleanup.push(() => el85.removeEventListener('click', handler_el85_click));
        el68.appendChild(el85);
        const el87 = document.createElement('button');
        el87.setAttribute('type', 'button');
        const handler_el87_click = (e) => {
            this.resetSubmit();
            this.__scheduleRender();
        };

        el87.addEventListener('click', handler_el87_click);
        const el88 = document.createTextNode('Reset');
        el87.appendChild(el88);
        this.__cleanup.push(() => el87.removeEventListener('click', handler_el87_click));
        el68.appendChild(el87);
    el65.appendChild(el68);
    el0.appendChild(el65);
        const el89 = document.createElement('div');
        el89.setAttribute('class', 'test-section');
            const el90 = document.createElement('h2');
            const el91 = document.createTextNode('Reset Test');
        el90.appendChild(el91);
    el89.appendChild(el90);
        const el92 = document.createElement('form');
        el92.setAttribute('textContent', 'resetForm');
            const el93 = document.createElement('label');
            const el94 = document.createTextNode('Value:');
        el93.appendChild(el94);
    el92.appendChild(el93);
        const el95 = document.createElement('input');
        el95.setAttribute('type', 'text');
        el95.setAttribute('textContent', 'value');
        el92.appendChild(el95);
        const el96 = document.createElement('div');
        el96.setAttribute('class', 'status');
            const el97 = document.createTextNode('Value: @resetForm.value | \r\n        Dirty: @resetForm.value.$dirty\r\n      ');
        el96.appendChild(el97);
    el92.appendChild(el96);
        const el98 = document.createElement('button');
        el98.setAttribute('type', 'button');
        const handler_el98_click = (e) => {
            this.resetField();
            this.__scheduleRender();
        };

        el98.addEventListener('click', handler_el98_click);
        const el99 = document.createTextNode('Reset Field');
        el98.appendChild(el99);
        this.__cleanup.push(() => el98.removeEventListener('click', handler_el98_click));
        el92.appendChild(el98);
        const el100 = document.createElement('button');
        el100.setAttribute('type', 'button');
        const handler_el100_click = (e) => {
            this.resetWholeForm();
            this.__scheduleRender();
        };

        el100.addEventListener('click', handler_el100_click);
        const el101 = document.createTextNode('Reset Form');
        el100.appendChild(el101);
        this.__cleanup.push(() => el100.removeEventListener('click', handler_el100_click));
        el92.appendChild(el100);
    el89.appendChild(el92);
    el0.appendChild(el89);
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

      email: ''
    }

      username: ''
    }

      value: ''
    }

      name: '',
      email: ''
    }

      value: 'initial'
    }

    onInit() {
      // Add validators
      forms.addValidation(this.requiredForm, 'username', 
        forms.validators.required('Username is required')
      );
  
      forms.addValidation(this.emailForm, 'email', 
        forms.validators.email('Invalid email format')
      );
  
      forms.addValidation(this.asyncForm, 'username', 
        forms.validators.required('Username is required'),
        'blur'
      );
  
      forms.addValidation(this.asyncForm, 'username', 
        async (value) => {
          await new Promise(r => setTimeout(r, 1000));
          if (value === 'taken') {
            return { valid: false, errors: [{ code: 'taken', message: 'Username already taken' }] };
          }
          return { valid: true, errors: [] };
        },
        'blur'
      );
  
      forms.addValidation(this.blurForm, 'value', 
        forms.validators.required('Value is required'),
        'blur'
      );
  
      forms.addValidation(this.submitForm, 'name', 
        forms.validators.required('Name is required')
      );
  
      forms.addValidation(this.submitForm, 'email', 
        forms.validators.email('Invalid email')
      );
    }

    validateRequired() {
      forms.validate(this.requiredForm, 'username', this.requiredForm.username, this.requiredForm, 'manual');
    }

    resetRequired() {
      const field = forms.getFieldState(this.requiredForm, 'username');
      field.reset();
    }

    validateEmail() {
      forms.validate(this.emailForm, 'email', this.emailForm.email, this.emailForm, 'manual');
    }

    validateAsync() {
      forms.validate(this.asyncForm, 'username', this.asyncForm.username, this.asyncForm, 'manual');
    }

    submitFormTest() {
      const formState = forms.getFormState(this.submitForm);
      formState.submit(async (data) => {
        console.log('Form submitted:', data);
        return { success: true };
      });
    }

    resetSubmit() {
      const formState = forms.getFormState(this.submitForm);
      formState.reset();
    }

    resetField() {
      const field = forms.getFieldState(this.resetForm, 'value');
      field.reset();
    }

    resetWholeForm() {
      const formState = forms.getFormState(this.resetForm);
      formState.reset();
    }

    onDestroy() {
      forms.destroy(this.requiredForm);
      forms.destroy(this.emailForm);
      forms.destroy(this.asyncForm);
      forms.destroy(this.blurForm);
      forms.destroy(this.submitForm);
      forms.destroy(this.resetForm);
    }
}


// Auto-mount component
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const app = new Forms();
        const container = document.querySelector('#app') as HTMLElement;
        if (container) {
            app.__render(container);
        }
    });
}

// Styles
const styles_Forms = `
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

label {
  display: block;
  margin: 10px 0 5px 0;
}

input {
  padding: 8px;
  width: 300px;
  border: 1px solid #ccc;
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

.error {
  color: #dc3545;
  margin: 5px 0;
}

.pending {
  color: #ffc107;
  margin: 5px 0;
}

.status {
  margin: 10px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 3px;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
    const styleEl = document.createElement('style');
    styleEl.textContent = styles_Forms;
    document.head.appendChild(styleEl);
}
