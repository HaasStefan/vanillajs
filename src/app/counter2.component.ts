import { map } from "rxjs";
import { createStore } from "src/vanilla/store";
import { Component, prop } from "src/vanilla/components";

class CounterElement extends Component {
  readonly #store = createStore({ count: 0 }, this.destroy$);
  readonly count$ = this.#store.get("count");

  readonly isPositive$ = this.count$.pipe(
    map((count) => count > 0)
  );

  countElement!: HTMLElement;

  onMount() {
    this.shadowRoot!.innerHTML = /* html */ `
      <div>
        <h2 id="count">Counter: ${this.count$.getValue()}</h2>
        <button id="increment">Increment</button>
        <button id="decrement">Decrement</button>

        <x-if condition="${prop(this.isPositive$)}">
          <p>Counter is positive</p>
        </x-if>
      </div>
    `;

    this.count$.subscribe((count) => {
      if (!this.countElement) return;

      this.countElement.textContent = `Counter: ${count}`;
    });

    this.countElement = this.shadowRoot!.querySelector("#count")!;

    this.shadowRoot!.querySelector("#increment")!.addEventListener("click", () => {
      this.#store.patchState({ count: this.#store.get("count").getValue() + 1 });
    });

    this.shadowRoot!.querySelector("#decrement")!.addEventListener("click", () => {
      this.#store.patchState({ count: this.#store.get("count").getValue() - 1 });
    });
  }
}

customElements.define("app-root", CounterElement);
