import { getValue, setValue } from './access';

export function getNestedValue(data: object, path: string): any {
  const parts = path.split('.');
  let current: any = data;

  for (const part of parts) {
    if (current == null) return undefined;
    current = current[part];
  }

  return current;
}

export function setNestedValue(data: object, path: string, value: any): void {
  const parts = path.split('.');
  let current: any = data;

  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i];
    if (current[part] == null) {
      current[part] = {};
    }
    current = current[part];
  }

  current[parts[parts.length - 1]] = value;
}

export function hasNestedProperty(data: object, path: string): boolean {
  const parts = path.split('.');
  let current: any = data;

  for (const part of parts) {
    if (current == null || !(part in current)) return false;
    current = current[part];
  }

  return true;
}
