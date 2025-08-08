import type { RxState } from "./State";

export type Component<T extends object> = (
  state: RxState<T>,
  shadowRoot: ShadowRoot
) => () => string;

export function createComponent<T extends object>(
  tagName: string,
  createState: () => RxState<T>,
  component: Component<T>
) {
  class CustomElement extends HTMLElement {
    readonly state = createState();
    
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
      const c = component(this.state, this.shadowRoot!);
      this.#render(c);
      this.state.onChange(() => {
        console.log("State changed, re-rendering component");
        this.#render(c);
      });
    }

    #render(component: () => string) {
      this.shadowRoot!.innerHTML = component();
    }
  }

  customElements.define(tagName, CustomElement);
  return CustomElement;
}

export function useCallback(callback: () => void): string {
  return `(${callback})()`;
}

export type EventDispatcher = () => string;

export function useEventListener(
  eventName: string,
  shadowRoot: ShadowRoot,
  callback: () => void
): EventDispatcher {
  shadowRoot.addEventListener(eventName, callback);

  return () =>
    /* javascript */ `this.dispatchEvent(new CustomEvent('${eventName}', { bubbles: true }))`;
}
