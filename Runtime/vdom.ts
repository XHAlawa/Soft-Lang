/**
 * Virtual DOM implementation for efficient updates.
 * Diffs old and new virtual trees and patches only changed nodes.
 */

export type VNodeType = 'element' | 'text' | 'component';

export interface VNode {
    type: VNodeType;
    tag?: string;
    props?: Record<string, any>;
    children?: VNode[];
    text?: string;
    key?: string | number;
    el?: Node;
}

export class VirtualDOM {
    /**
     * Create a virtual node
     */
    static h(tag: string, props?: Record<string, any>, ...children: (VNode | string)[]): VNode {
        return {
            type: 'element',
            tag,
            props: props || {},
            children: children.map(child => 
                typeof child === 'string' 
                    ? { type: 'text', text: child } 
                    : child
            ),
            key: props?.key
        };
    }
    
    /**
     * Create a text node
     */
    static text(content: string): VNode {
        return {
            type: 'text',
            text: content
        };
    }
    
    /**
     * Mount virtual node to real DOM
     */
    static mount(vnode: VNode, container: HTMLElement): void {
        const el = this.createElement(vnode);
        vnode.el = el;
        container.appendChild(el);
    }
    
    /**
     * Patch (update) DOM with new virtual node
     */
    static patch(oldVNode: VNode | null, newVNode: VNode, container?: HTMLElement): Node {
        // No old node - mount new one
        if (!oldVNode) {
            const el = this.createElement(newVNode);
            newVNode.el = el;
            if (container) container.appendChild(el);
            return el;
        }
        
        // No new node - remove old one
        if (!newVNode) {
            if (oldVNode.el?.parentNode) {
                oldVNode.el.parentNode.removeChild(oldVNode.el);
            }
            return null as any;
        }
        
        // Different types - replace
        if (oldVNode.type !== newVNode.type || oldVNode.tag !== newVNode.tag) {
            const el = this.createElement(newVNode);
            newVNode.el = el;
            if (oldVNode.el?.parentNode) {
                oldVNode.el.parentNode.replaceChild(el, oldVNode.el);
            }
            return el;
        }
        
        // Same type - update
        newVNode.el = oldVNode.el;
        
        if (newVNode.type === 'text') {
            if (oldVNode.text !== newVNode.text) {
                (newVNode.el as Text).textContent = newVNode.text || '';
            }
            return newVNode.el!;
        }
        
        if (newVNode.type === 'element') {
            // Update props
            this.patchProps(oldVNode.props || {}, newVNode.props || {}, newVNode.el as HTMLElement);
            
            // Update children
            this.patchChildren(oldVNode.children || [], newVNode.children || [], newVNode.el as HTMLElement);
        }
        
        return newVNode.el!;
    }
    
    /**
     * Create real DOM element from virtual node
     */
    private static createElement(vnode: VNode): Node {
        if (vnode.type === 'text') {
            return document.createTextNode(vnode.text || '');
        }
        
        const el = document.createElement(vnode.tag!);
        
        // Set props
        if (vnode.props) {
            for (const [key, value] of Object.entries(vnode.props)) {
                this.setProp(el, key, value);
            }
        }
        
        // Append children
        if (vnode.children) {
            for (const child of vnode.children) {
                const childEl = this.createElement(child);
                child.el = childEl;
                el.appendChild(childEl);
            }
        }
        
        return el;
    }
    
    /**
     * Patch element properties
     */
    private static patchProps(oldProps: Record<string, any>, newProps: Record<string, any>, el: HTMLElement): void {
        // Remove old props
        for (const key in oldProps) {
            if (!(key in newProps)) {
                this.removeProp(el, key);
            }
        }
        
        // Set new props
        for (const [key, value] of Object.entries(newProps)) {
            if (oldProps[key] !== value) {
                this.setProp(el, key, value);
            }
        }
    }
    
    /**
     * Patch children with key-based diffing
     */
    private static patchChildren(oldChildren: VNode[], newChildren: VNode[], parent: HTMLElement): void {
        // Simple case: no keys
        if (!oldChildren.some(c => c.key) && !newChildren.some(c => c.key)) {
            this.patchChildrenSimple(oldChildren, newChildren, parent);
            return;
        }
        
        // Key-based diffing
        this.patchChildrenKeyed(oldChildren, newChildren, parent);
    }
    
    /**
     * Simple children patching (no keys)
     */
    private static patchChildrenSimple(oldChildren: VNode[], newChildren: VNode[], parent: HTMLElement): void {
        const commonLength = Math.min(oldChildren.length, newChildren.length);
        
        // Patch common children
        for (let i = 0; i < commonLength; i++) {
            this.patch(oldChildren[i], newChildren[i]);
        }
        
        // Add new children
        if (newChildren.length > oldChildren.length) {
            for (let i = commonLength; i < newChildren.length; i++) {
                const el = this.createElement(newChildren[i]);
                newChildren[i].el = el;
                parent.appendChild(el);
            }
        }
        
        // Remove old children
        if (oldChildren.length > newChildren.length) {
            for (let i = commonLength; i < oldChildren.length; i++) {
                const parent = oldChildren[i].el?.parentNode;
                const el = oldChildren[i].el;
                if (parent && el) {
                    parent.removeChild(el);
                }
            }
        }
    }
    
    /**
     * Key-based children patching (optimized for lists)
     */
    private static patchChildrenKeyed(oldChildren: VNode[], newChildren: VNode[], parent: HTMLElement): void {
        const oldKeyMap = new Map<string | number, VNode>();
        
        // Build key map
        oldChildren.forEach((child, i) => {
            if (child.key != null) {
                oldKeyMap.set(child.key, child);
            }
        });
        
        let lastIndex = 0;
        
        // Patch and reorder
        for (let i = 0; i < newChildren.length; i++) {
            const newChild = newChildren[i];
            const key = newChild.key;
            
            if (key != null && oldKeyMap.has(key)) {
                // Reuse existing node
                const oldChild = oldKeyMap.get(key)!;
                this.patch(oldChild, newChild);
                
                // Move if needed
                const oldIndex = oldChildren.indexOf(oldChild);
                if (oldIndex < lastIndex) {
                    // Move forward
                    const refNode = i < newChildren.length - 1 ? newChildren[i + 1].el || null : null;
                    parent.insertBefore(newChild.el!, refNode);
                } else {
                    lastIndex = oldIndex;
                }
                
                oldKeyMap.delete(key);
            } else {
                // Create new node
                const el = this.createElement(newChild);
                newChild.el = el;
                const refNode = i < newChildren.length - 1 ? newChildren[i + 1].el || null : null;
                parent.insertBefore(el, refNode);
            }
        }
        
        // Remove unused old nodes
        oldKeyMap.forEach(oldChild => {
            if (oldChild.el?.parentNode) {
                oldChild.el.parentNode.removeChild(oldChild.el);
            }
        });
    }
    
    /**
     * Set element property
     */
    private static setProp(el: HTMLElement, key: string, value: any): void {
        if (key === 'key') return; // Skip key prop
        
        if (key.startsWith('on')) {
            // Event listener
            const event = key.substring(2).toLowerCase();
            el.addEventListener(event, value);
        } else if (key === 'className') {
            el.className = value;
        } else if (key === 'style' && typeof value === 'object') {
            Object.assign(el.style, value);
        } else if (key in el) {
            (el as any)[key] = value;
        } else {
            el.setAttribute(key, value);
        }
    }
    
    /**
     * Remove element property
     */
    private static removeProp(el: HTMLElement, key: string): void {
        if (key.startsWith('on')) {
            // Can't easily remove event listener without reference
            // This is a limitation - would need to track listeners
        } else if (key === 'className') {
            el.className = '';
        } else if (key in el) {
            (el as any)[key] = '';
        } else {
            el.removeAttribute(key);
        }
    }
}

// Export helpers
export const h = VirtualDOM.h.bind(VirtualDOM);
export const text = VirtualDOM.text.bind(VirtualDOM);
export const mount = VirtualDOM.mount.bind(VirtualDOM);
export const patch = VirtualDOM.patch.bind(VirtualDOM);
