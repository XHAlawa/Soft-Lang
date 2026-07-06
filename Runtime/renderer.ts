// Soft Rendering Engine - Compiler-driven DOM updates
// No Virtual DOM. No diffing. Direct updates only.

// DOM Operation - Compiler-generated metadata
interface DOMOperation {
    type: 'create' | 'update' | 'remove' | 'replace';
    nodeId: string;
    target?: string;
    value?: any;
    attrs?: Record<string, string>;
    props?: Record<string, any>;
}

// Render Metadata - Compiler-generated
interface RenderMetadata {
    template: string;
    bindings: Map<string, DOMOperation[]>;
    conditionals: Map<string, ConditionalMetadata>;
    loops: Map<string, LoopMetadata>;
}

interface ConditionalMetadata {
    condition: string;
    nodeId: string;
    placeholder: string;
}

interface LoopMetadata {
    items: string;
    nodeId: string;
    template: string;
}

// DOM Node Cache - Reuse references
class DOMNodeCache {
    private cache = new Map<string, HTMLElement>();

    set(id: string, node: HTMLElement): void {
        this.cache.set(id, node);
    }

    get(id: string): HTMLElement | undefined {
        return this.cache.get(id);
    }

    delete(id: string): void {
        this.cache.delete(id);
    }

    clear(): void {
        this.cache.clear();
    }
}

// Render Queue - Batch updates
class RenderQueue {
    private queue: Array<() => void> = [];
    private scheduled = false;

    enqueue(fn: () => void): void {
        this.queue.push(fn);
        this.schedule();
    }

    private schedule(): void {
        if (this.scheduled) return;
        this.scheduled = true;
        requestAnimationFrame(() => this.flush());
    }

    private flush(): void {
        const ops = this.queue.splice(0);
        for (const op of ops) {
            try {
                op();
            } catch (err) {
                console.error('Render error:', err);
            }
        }
        this.scheduled = false;
    }
}

// DOM Patch Scheduler - Execute compiler metadata
class DOMPatchScheduler {
    private cache: DOMNodeCache;
    private queue: RenderQueue;

    constructor(cache: DOMNodeCache, queue: RenderQueue) {
        this.cache = cache;
        this.queue = queue;
    }

    scheduleUpdate(nodeId: string, operation: DOMOperation): void {
        this.queue.enqueue(() => this.executeOperation(nodeId, operation));
    }

    private executeOperation(nodeId: string, op: DOMOperation): void {
        const node = this.cache.get(nodeId);
        if (!node) return;

        switch (op.type) {
            case 'update':
                this.updateNode(node, op);
                break;
            case 'remove':
                this.removeNode(node);
                break;
            case 'replace':
                this.replaceNode(node, op);
                break;
        }
    }

    private updateNode(node: HTMLElement, op: DOMOperation): void {
        if (op.target === 'text') {
            node.textContent = String(op.value ?? '');
        } else if (op.target === 'attr' && op.attrs) {
            for (const [key, value] of Object.entries(op.attrs)) {
                node.setAttribute(key, value);
            }
        } else if (op.target === 'prop' && op.props) {
            for (const [key, value] of Object.entries(op.props)) {
                (node as any)[key] = value;
            }
        } else if (op.target === 'class') {
            node.className = String(op.value ?? '');
        } else if (op.target === 'style' && op.props) {
            for (const [key, value] of Object.entries(op.props)) {
                (node.style as any)[key] = value;
            }
        } else if (op.target === 'visible') {
            node.style.display = op.value ? '' : 'none';
        }
    }

    private removeNode(node: HTMLElement): void {
        node.remove();
    }

    private replaceNode(node: HTMLElement, op: DOMOperation): void {
        if (!op.value) return;
        const newNode = this.createNode(op.value);
        node.replaceWith(newNode);
    }

    private createNode(html: string): HTMLElement {
        const template = document.createElement('template');
        template.innerHTML = html.trim();
        return template.content.firstChild as HTMLElement;
    }
}

// Initial Renderer - First render from metadata
class InitialRenderer {
    private cache: DOMNodeCache;

    constructor(cache: DOMNodeCache) {
        this.cache = cache;
    }

    render(container: HTMLElement, metadata: RenderMetadata): void {
        const template = document.createElement('template');
        template.innerHTML = metadata.template.trim();
        const root = template.content.cloneNode(true);

        this.registerNodes(root as DocumentFragment);
        container.appendChild(root);
    }

    private registerNodes(root: DocumentFragment): void {
        const walker = document.createTreeWalker(
            root,
            NodeFilter.SHOW_ELEMENT,
            null
        );

        let node: Node | null;
        while ((node = walker.nextNode())) {
            const element = node as HTMLElement;
            const id = element.getAttribute('data-soft-id');
            if (id) {
                this.cache.set(id, element);
            }
        }
    }
}

// Conditional Renderer - @if
class ConditionalRenderer {
    private cache: DOMNodeCache;
    private scheduler: DOMPatchScheduler;
    private placeholders = new Map<string, Comment>();

    constructor(cache: DOMNodeCache, scheduler: DOMPatchScheduler) {
        this.cache = cache;
        this.scheduler = scheduler;
    }

    render(metadata: ConditionalMetadata, condition: boolean): void {
        const node = this.cache.get(metadata.nodeId);
        
        if (condition) {
            if (!node) {
                this.mount(metadata);
            }
        } else {
            if (node) {
                this.unmount(metadata);
            }
        }
    }

    private mount(metadata: ConditionalMetadata): void {
        const placeholder = this.placeholders.get(metadata.nodeId);
        if (!placeholder) return;

        const template = document.createElement('template');
        template.innerHTML = metadata.placeholder.trim();
        const node = template.content.firstChild as HTMLElement;

        placeholder.replaceWith(node);
        this.cache.set(metadata.nodeId, node);
    }

    private unmount(metadata: ConditionalMetadata): void {
        const node = this.cache.get(metadata.nodeId);
        if (!node) return;

        const placeholder = document.createComment(`soft-if:${metadata.nodeId}`);
        node.replaceWith(placeholder);
        this.placeholders.set(metadata.nodeId, placeholder);
        this.cache.delete(metadata.nodeId);
    }
}

// Loop Renderer - @foreach
class LoopRenderer {
    private cache: DOMNodeCache;
    private scheduler: DOMPatchScheduler;
    private containers = new Map<string, HTMLElement>();

    constructor(cache: DOMNodeCache, scheduler: DOMPatchScheduler) {
        this.cache = cache;
        this.scheduler = scheduler;
    }

    render(metadata: LoopMetadata, items: any[]): void {
        const container = this.containers.get(metadata.nodeId);
        if (!container) return;

        container.innerHTML = '';

        for (let i = 0; i < items.length; i++) {
            const itemNode = this.createItem(metadata, items[i], i);
            container.appendChild(itemNode);
        }
    }

    private createItem(metadata: LoopMetadata, item: any, index: number): HTMLElement {
        const template = document.createElement('template');
        template.innerHTML = metadata.template.trim();
        const node = template.content.firstChild as HTMLElement;

        const itemId = `${metadata.nodeId}-${index}`;
        node.setAttribute('data-soft-id', itemId);
        this.cache.set(itemId, node);

        return node;
    }

    registerContainer(nodeId: string, container: HTMLElement): void {
        this.containers.set(nodeId, container);
    }
}

// Component Renderer - Mount/unmount components
class ComponentRenderer {
    private cache: DOMNodeCache;
    private mounted = new Map<string, HTMLElement>();

    constructor(cache: DOMNodeCache) {
        this.cache = cache;
    }

    async mount(componentId: string, container: HTMLElement, factory: () => Promise<any>): Promise<void> {
        const instance = await factory();
        
        if (instance.render) {
            const html = instance.render();
            const template = document.createElement('template');
            template.innerHTML = html.trim();
            const root = template.content.firstChild as HTMLElement;

            container.appendChild(root);
            this.mounted.set(componentId, root);
            this.cache.set(componentId, root);

            if (instance.onMount) {
                await instance.onMount();
            }
        }
    }

    async unmount(componentId: string): Promise<void> {
        const node = this.mounted.get(componentId);
        if (!node) return;

        node.remove();
        this.mounted.delete(componentId);
        this.cache.delete(componentId);
    }
}

// Rendering Engine
export class RenderingEngine {
    private cache: DOMNodeCache;
    private queue: RenderQueue;
    private scheduler: DOMPatchScheduler;
    private initialRenderer: InitialRenderer;
    private conditionalRenderer: ConditionalRenderer;
    private loopRenderer: LoopRenderer;
    private componentRenderer: ComponentRenderer;

    constructor() {
        this.cache = new DOMNodeCache();
        this.queue = new RenderQueue();
        this.scheduler = new DOMPatchScheduler(this.cache, this.queue);
        this.initialRenderer = new InitialRenderer(this.cache);
        this.conditionalRenderer = new ConditionalRenderer(this.cache, this.scheduler);
        this.loopRenderer = new LoopRenderer(this.cache, this.scheduler);
        this.componentRenderer = new ComponentRenderer(this.cache);
    }

    // Initial render
    renderInitial(container: HTMLElement, metadata: RenderMetadata): void {
        this.initialRenderer.render(container, metadata);
    }

    // Update single property
    updateProperty(nodeId: string, operations: DOMOperation[]): void {
        for (const op of operations) {
            this.scheduler.scheduleUpdate(nodeId, op);
        }
    }

    // Conditional rendering
    renderConditional(metadata: ConditionalMetadata, condition: boolean): void {
        this.conditionalRenderer.render(metadata, condition);
    }

    // Loop rendering
    renderLoop(metadata: LoopMetadata, items: any[]): void {
        this.loopRenderer.render(metadata, items);
    }

    // Component lifecycle
    async mountComponent(id: string, container: HTMLElement, factory: () => Promise<any>): Promise<void> {
        await this.componentRenderer.mount(id, container, factory);
    }

    async unmountComponent(id: string): Promise<void> {
        await this.componentRenderer.unmount(id);
    }

    // Get cached node
    getNode(id: string): HTMLElement | undefined {
        return this.cache.get(id);
    }

    // Clear cache
    clear(): void {
        this.cache.clear();
    }
}

// Global renderer instance
export const renderer = new RenderingEngine();
