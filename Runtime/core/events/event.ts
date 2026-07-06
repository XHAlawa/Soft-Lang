import { Subscription } from './subscription';
import { EventHandler, EventHandlerMetadata } from './types';

class RuntimeEventSubscription implements Subscription {
  private _disposed: boolean = false;

  constructor(
    private event: RuntimeEvent<any>,
    private handler: EventHandler
  ) {}

  dispose(): void {
    if (this._disposed) return;
    this._disposed = true;
    this.event.unsubscribe(this.handler);
  }

  get disposed(): boolean {
    return this._disposed;
  }
}

export class RuntimeEvent<T> {
  private handlers: Set<EventHandler> = new Set();

  subscribe(handler: EventHandler): Subscription {
    this.handlers.add(handler);
    return new RuntimeEventSubscription(this, handler);
  }

  unsubscribe(handler: EventHandler): void {
    this.handlers.delete(handler);
  }

  dispatch(before?: T, after?: T): void {
    for (const handler of this.handlers) {
      const paramCount = handler.length;

      if (paramCount === 0) {
        (handler as () => void)();
      } else if (paramCount === 1) {
        (handler as (arg1: any) => void)(after);
      } else if (paramCount === 2) {
        (handler as (arg1: any, arg2: any) => void)(before, after);
      }
    }
  }

  hasSubscribers(): boolean {
    return this.handlers.size > 0;
  }

  clear(): void {
    this.handlers.clear();
  }
}
