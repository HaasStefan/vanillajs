type Teardown = () => void;
type Subscriber<T> = (value: T) => void;

interface WritableObservable<T> {
  subscribe(subscriber: Subscriber<T>): Teardown;
  currentValue: T;
  next(value: T): void;
}

interface Store<T> {
  <K extends keyof T>(key: K): WritableObservable<T[K]>;
  patchState(patch: Partial<T>): void;
}

export function createStore<
  T extends Record<string, any>
>(
  initialState: T,
  abortController: AbortController
): Store<T> {
  let state = { ...initialState };

  const subscribers: { [K in keyof T]: Set<Subscriber<T[K]>> } = {} as any;
  for (const key in initialState) {
    subscribers[key] = new Set();
  }

  function setValue<K extends keyof T>(key: K, value: T[K]) {
    state[key] = value;
    for (const sub of subscribers[key]) {
      sub(value);
    }
  }

  function store<K extends keyof T>(key: K): WritableObservable<T[K]> {
    return {
      subscribe(subscriber: Subscriber<T[K]>) {
        subscriber(state[key]); // emit current value
        subscribers[key].add(subscriber);

        const signal = abortController.signal;
        const abortHandler = () => {
          subscribers[key].delete(subscriber);
        };

        signal.addEventListener("abort", abortHandler);

        return () => {
          subscribers[key].delete(subscriber);
          signal.removeEventListener("abort", abortHandler);
        };
      },
      get currentValue() {
        return state[key];
      },
      next(value: T[K]) {
        setValue(key, value);
      }
    };
  }

  store.patchState = (patch: Partial<T>) => {
    for (const key in patch) {
      setValue(key as keyof T, patch[key as keyof T]!);
    }
  };

  return store;
}
