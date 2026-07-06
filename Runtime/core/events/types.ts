export type EventHandler = (...args: any[]) => void;

export interface EventHandlerMetadata {
  handler: EventHandler;
  paramCount: number;
}
