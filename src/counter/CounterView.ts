import { type CounterState } from "./CounterModel";

export function render(
  state: CounterState 
): string {
  return /*html*/ `
    <button id="decrement">-</button>
    <span id="count">${state.count}</span>
    <button id="increment">+</button>
  `;
}