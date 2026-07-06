import { RuntimeEvent } from './event';

export function dispatchEvent<T>(event: RuntimeEvent<T>, before?: T, after?: T): void {
  event.dispatch(before, after);
}
