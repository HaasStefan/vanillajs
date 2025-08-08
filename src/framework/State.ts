
export interface RxState<T extends object> {
  state: T;
  onChange: (callback: (changedProperty: keyof T, value: T[keyof T]) => void) => void;
}

export function createRxState<T extends object>(initialState: T): RxState<T> {
  let callback: ((changedProperty: keyof T, value: T[keyof T]) => void) | undefined;

  const notifyCallback = (changedProperty: keyof T, value: T[keyof T]) => {
    if (callback) {
      callback(changedProperty, value);
    }
  };
  
  const proxiedState = createProxy(initialState, notifyCallback);
  
  return {
    state: proxiedState,
    onChange: (cb: (changedProperty: keyof T, value: T[keyof T]) => void) => {
      callback = cb;
    }
  };
}

function createProxy<T extends object>(
  target: T, 
  notifyCallbacks: (changedProperty: keyof T, value: T[keyof T]) => void
): T {
  return new Proxy(target, {
    set(obj, prop, value) {
      // Check if the value actually changed
      if (obj[prop as keyof T] !== value) {
        obj[prop as keyof T] = value;
        notifyCallbacks(prop as keyof T, value);
      }
      return true;
    },
    get(obj, prop) {
      const value = obj[prop as keyof T];
      return value;
    }
  });
}

