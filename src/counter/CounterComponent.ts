import { createComponent, useCallback } from "../framework/Component";
import { createRxState, type RxState } from "../framework/State";
import { initialState, type CounterState } from "./CounterModel";

export function Counter(state: RxState<CounterState>) {

  const increment = useCallback(() => {
    console.log(state.state.count);
    state.state.count++;
  });

  const decrement = useCallback(() => {
    console.log(state.state.count);
    state.state.count--;
  });

  return () => /* html */ `
    <button id="decrement" onclick="${decrement}">-</button>
    <span id="count">${state.state.count}</span>
    <button id="increment" onclick="${increment}">+</button>
  `;
}

createComponent("app-root", createRxState(initialState), Counter);


