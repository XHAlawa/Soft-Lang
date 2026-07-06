export interface Subscription {
  dispose(): void;
  readonly disposed: boolean;
}
