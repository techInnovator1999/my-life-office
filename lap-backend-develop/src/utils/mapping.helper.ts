// import { AgeCalc } from './util.helper';
export function refById<T extends { id: string }>(id: string): T {
  return { id } as T;
}

export function refManyByIds<T extends { id: string }>(ids: string[]): T[] {
  return ids.map((id) => ({ id }) as T);
}

export function refObjectsById<T extends { id: string }>(
  objects: { id: string }[],
): T[] {
  return objects.map((obj) => ({ id: obj.id }) as T);
}
