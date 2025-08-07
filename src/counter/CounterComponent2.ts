import { createComponent, useEventListener } from "../framework/Component";
import { createRxState, type RxState } from "../framework/State";
import { initialState, type CounterState } from "./CounterModel";

export function Counter(state: RxState<CounterState>, shadowRoot: ShadowRoot) {
  const increment = useEventListener("increment", shadowRoot, () => {
    console.log(state.state.count);
    state.state.count++;
  });

  const decrement = useEventListener("decrement", shadowRoot, () => {
    console.log(state.state.count);
    state.state.count--;
  });

  return () => /* html */ `
    <button id="decrement" onclick="${decrement()}">-</button>
    <span id="count">${state.state.count}</span>
    <button id="increment" onclick="${increment()}">+</button>
  `;
}

createComponent("app-root", createRxState(initialState), Counter);


// TODO:
// useEffect() with tracking
// untracked state updates (which do not trigger re-render)
// inputs, outputs