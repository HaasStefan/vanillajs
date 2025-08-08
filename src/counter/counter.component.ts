import { createComponent, useEventListener } from "../framework/Component";
import {
  createCounterState
} from "./counter.state";


createComponent(
  "app-root", 
  createCounterState, 
  (state, shadowRoot) => {
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
});
