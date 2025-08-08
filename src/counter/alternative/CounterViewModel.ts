import { createRxState } from "../framework/State";
import { initialState } from "./CounterModel";
import { render } from "./CounterView";

export class Counter extends HTMLElement {
  #state = createRxState(initialState);

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.#render();
    this.#state.onChange(() => {
      this.#render();
    });
  }

  #render() {
    const state = this.#state.state;
    this.shadowRoot!.innerHTML = render(state);
    this.#setupEventListeners();
  }

  #setupEventListeners() {
    this.shadowRoot!.getElementById("increment")!.addEventListener(
      "click",
      () => {
        this.#state.state.count++;
      }
    );

    this.shadowRoot!.getElementById("decrement")!.addEventListener(
      "click",
      () => {
        this.#state.state.count--;
      }
    );
  }
}