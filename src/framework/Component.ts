import type { RxState } from "./State";

export type Component<T extends object> = (
  state: RxState<T>,
  shadowRoot: ShadowRoot
) => () => string;

export function createComponent<T extends object>(
  {
    tagName,
    createState,
    styleUrls = [],
  }: {
    tagName: string;
    createState: () => RxState<T>;
    styleUrls?: string[];
  },
  component: Component<T>
) {
  class CustomElement extends HTMLElement {
    readonly state = createState();
    #styleElement: HTMLStyleElement | null = null;

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.loadStylesAsync();
    }

    connectedCallback() {
      const c = component(this.state, this.shadowRoot!);
      this.#render(c);
      this.state.onChange(() => {
        this.#render(c);
      });
    }

    #render(component: () => string) {
      this.shadowRoot!.innerHTML = component();
      if (this.#styleElement) {
        this.shadowRoot!.appendChild(this.#styleElement);
      }
    }

    async loadStylesAsync() {
      console.log("Loading styles:", styleUrls);
      const cssTexts = await Promise.all(
        styleUrls.map(async (url) => {
          const response = await fetch(url);
          console.log("Fetched style:", url);
          if (!response.ok) {
            throw new Error(`Failed to load style: ${url}`);
          }
          const cssText = await response.text();
          console.log("Loaded style content:", cssText);
          return cssText;
        })
      );

      this.#styleElement = document.createElement("style");
      this.#styleElement.textContent = cssTexts.join("\n");
      this.shadowRoot!.appendChild(this.#styleElement);
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
