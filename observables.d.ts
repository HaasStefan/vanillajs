export {}; // <-- makes this file a module


declare global {
    interface Subscriber<T> {
    next(value: T): void;
    error(err: any): void;
    complete(): void;
  }

  interface Observable<T> {
    subscribe(observer: Partial<Subscriber<T>>): { unsubscribe(): void };
  }

  var Observable: {
    prototype: Observable<any>;
    new <T>(
      subscriber: (observer: Subscriber<T>) => (() => void) | void
    ): Observable<T>;
  };
}
