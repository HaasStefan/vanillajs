import { createStore } from "./store";

class BaseHTMLElement extends HTMLElement {
  protected readonly abortController = new AbortController();

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.onMount();
  }

  disconnectedCallback() {
    this.abortController.abort();
    this.onMount();
  }

  protected onMount(): void {
    // Override in subclasses
  }

  protected onUnmount(): void {
    // Override in subclasses
  }
}

class CounterElement extends BaseHTMLElement {
  readonly #store = createStore({ count: 0 }, this.abortController);
  readonly count$ = this.#store("count");

  countElement!: HTMLElement;

  constructor() {
    super();

    this.count$.subscribe((count) => {
      if (!this.countElement) return;

      this.countElement.textContent = `Counter: ${count}`;
    });
  }

  onMount() {
    this.shadowRoot!.innerHTML = /* html */ `
      <div>
        <h2 id="count">Counter: ${this.count$.currentValue}</h2>
        <button id="increment">Increment</button>
        <button id="decrement">Decrement</button>
      </div>
    `;

    this.countElement = this.querySelector("#count")!;

    this.querySelector("#increment")!.addEventListener("click", () => {
      this.count$.next(this.count$.currentValue + 1);
    });

    this.querySelector("#decrement")!.addEventListener("click", () => {
      this.count$.next(this.count$.currentValue - 1);
    });
  }
}

customElements.define("app-root", CounterElement);
