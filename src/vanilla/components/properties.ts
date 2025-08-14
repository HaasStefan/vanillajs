import type { Observable } from "rxjs";

export type PropertyKey = `prop-${ReturnType<typeof crypto.randomUUID>}`;

class PropertyRegistry {
  private properties = new Map<PropertyKey, Observable<any>>();

  private static instance: PropertyRegistry;

  private constructor() {}

  static getInstance(): PropertyRegistry {
    if (!PropertyRegistry.instance) {
      PropertyRegistry.instance = new PropertyRegistry();
    }
    return PropertyRegistry.instance;
  }

  register<T>(key: PropertyKey, state$: Observable<T>) {
    this.properties.set(key, state$);
  }

  get<T>(key: PropertyKey): Observable<T> | undefined {
    return this.properties.get(key) as Observable<T> | undefined;
  }
}

export function prop<T>(state$: Observable<T>): PropertyKey {
  const registry = PropertyRegistry.getInstance();
  const key: PropertyKey = `prop-${crypto.randomUUID()}`;
  registry.register(key, state$);

  return key;
}

export function useProp<T>(property: string, options: { required: true }): Observable<T>;
export function useProp<T>(property: string, options?: { required: boolean }): Observable<T> | undefined;
export function useProp<T>(property: string, options: { required: boolean } = { required: false }): Observable<T> | undefined {
  const key = asKey(property);
  const registry = PropertyRegistry.getInstance();
  const state$ = registry.get<T>(key);

  if (!state$ && options?.required) {
    throw new Error(`Property with key ${key} not found`);
  }

  return state$ as Observable<T> | undefined;
}

function asKey(property: string): PropertyKey {
  if (!property.startsWith("prop-")) {
    throw new Error(`Invalid property key: ${property}`);
  }

  if (property.split("-").length !== 6) {
    throw new Error(`Invalid property key: ${property}`);
  }

  return property as PropertyKey;
}
