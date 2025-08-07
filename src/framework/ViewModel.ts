import { createRxState } from "./State";

export function createViewModel<T extends object>({
  tagName,
  initialState,
  renderFn,
  onChanges,
  onInit,
  setupEventListeners
}: {
  tagName: `${string}-${string}`;
  initialState: T;
  renderFn: (state: T) => string;
  onChanges?: (changedProperty: keyof T, value: T[keyof T], state: T) => void;
  onInit?: (state: T) => void;
  setupEventListeners?: (element: ShadowRoot, state: T) => void;
}) {
  const customElement = class extends HTMLElement {
    #state = createRxState(initialState);

    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.#render();
      this.#state.onChange((changedProperty, value) => {
        onChanges?.(changedProperty, value, this.#state.state);
        this.#render();
      });
      onInit?.(this.#state.state);
    }

    #render() {
      const state = this.#state.state;
      this.shadowRoot!.innerHTML = renderFn(state);
      this.#setupEventListeners();
    }

    #setupEventListeners() {
      setupEventListeners?.(this.shadowRoot!, this.#state.state);
    }
  };

  customElements.define(tagName, customElement);
  return customElement;
}