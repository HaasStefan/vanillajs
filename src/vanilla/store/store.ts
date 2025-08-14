import { BehaviorSubject, Observable, Subject } from "rxjs";

export type Store<T extends Record<string, any>> = {
  [K in keyof T]: BehaviorSubject<T[K]>;
} & {
  patchState(patch: Partial<T>): void;
  get(key: string): StoreObservable<T[keyof T]>;
  destroy$: Subject<void>;
};

export type StoreObservable<T> = Observable<T> & {
  getValue(): T;
};

export function createStore<T extends Record<string, any>>(
  initialState: T,
  destroy$: Subject<void>
): Store<T> {
  const subjects = {} as { [K in keyof T]: BehaviorSubject<T[K]> };
  for (const key in initialState) {
    subjects[key] = new BehaviorSubject(initialState[key]);
  }

  destroy$.subscribe(() => {
    for (const key in subjects) {
      subjects[key].complete();
    }
    destroy$.complete();
  });

  const store = subjects as Store<T>;
  store.destroy$ = destroy$;

  store.patchState = (patch: Partial<T>) => {
    for (const key in patch) {
      subjects[key as keyof T].next(patch[key as keyof T]!);
    }
  };

  store.get = (key: string): StoreObservable<T[keyof T]> => {
    const subject = subjects[key as keyof T];
    if (!subject) {
      throw new Error(`No such key: ${key}`);
    }

    const storeObservable = subject.asObservable() as StoreObservable<T[keyof T]>;
    storeObservable.getValue = subject.getValue.bind(subject);

    return storeObservable;
  };

  return store;
}
