import { Observable, Subject } from "rxjs";
import { useProp } from "./properties";

export class Component extends HTMLElement {
  protected readonly destroy$ = new Subject<void>();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.onMount();
  }

  disconnectedCallback() {
    this.onUnmount();
    this.destroy$.next();
    this.destroy$.complete();
  }

  protected onMount(): void {
    // Override in subclasses
  }

  protected onUnmount(): void {
    // Override in subclasses
  }

  useProp<T>(attribute: string, options: { required: true }): Observable<T>;
  useProp<T>(
    attribute: string,
    options?: { required?: boolean }
  ): Observable<T> | undefined;
  useProp<T>(
    attribute: string,
    options: { required: boolean } = { required: false }
  ): Observable<T> | undefined {
    console.log(attribute)
    const property = this.getAttribute(attribute);
    if (!property) {
      if (options?.required) {
        throw new Error(`Attribute '${attribute}' is required`);
      }
      return undefined;
    }

    return useProp<T>(property, options);
  }
}
