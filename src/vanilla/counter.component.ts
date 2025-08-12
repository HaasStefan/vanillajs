import { createStore } from "./store";

class CounterElement extends HTMLElement {
  readonly #abortController = new AbortController();
  readonly #store = createStore({ count: 0 }, this.#abortController);
  readonly count$ = this.#store("count");

  countElement!: HTMLElement;

  constructor() {
    super();

    this.count$.subscribe((count) => {
      if (!this.countElement) return;

      this.countElement.textContent = `Counter: ${count}`;
    });
  }

  connectedCallback() {
    this.render();

    this.countElement = this.querySelector("#count")!;

    this.querySelector("#increment")!.addEventListener("click", () => {
      this.count$.next(this.count$.currentValue + 1);
    });

    this.querySelector("#decrement")!.addEventListener("click", () => {
      this.count$.next(this.count$.currentValue - 1);
    });
  }

  disconnectedCallback() {
    this.#abortController.abort();
  }

  private render() {
    this.innerHTML = /* html */ `
      <div>
        <h2 id="count">Counter: ${this.count$.currentValue}</h2>
        <button id="increment">Increment</button>
        <button id="decrement">Decrement</button>
      </div>
    `;
  }
}

customElements.define("app-root", CounterElement);
