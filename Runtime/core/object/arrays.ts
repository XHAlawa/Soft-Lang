export function getArrayItem(data: any, index: number): any {
  if (!Array.isArray(data)) return undefined;
  return data[index];
}

export function setArrayItem(data: any, index: number, value: any): void {
  if (!Array.isArray(data)) return;
  data[index] = value;
}

export function getArrayLength(data: any): number {
  if (!Array.isArray(data)) return 0;
  return data.length;
}
