import { createViewModel } from "../framework/ViewModel";
import { initialState } from "./CounterModel";

export default createViewModel({
  tagName: "app-root",
  initialState,
  renderFn: (state) => /*html*/ `
    <button id="decrement">-</button>
    <span id="count">${state.count}</span>
    <button id="increment">+</button>
  `,
  onChanges: (changedProperty, value, state) => {
    console.log(
      `Property changed: ${changedProperty}, New value: ${value}, Current state:`,
      state
    );
  },
  onInit: (state) => {
    console.log("CounterViewModel initialized with state:", state);
  },
  setupEventListeners: (element, state) => {
    element.getElementById("increment")!.addEventListener("click", () => {
      state.count++;
    });

    element.getElementById("decrement")!.addEventListener("click", () => {
      state.count--;
    });
  }
});
