import { createComponent, useEventListener } from "../framework/Component";
import {
  createCounterState
} from "./counter.state";
import  "./counter.component.module.css";

createComponent(
  {
    tagName: "app-root",
    styleUrls: ["./counter.component.css"],
    createState: createCounterState,
  },
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
    <button id="decrement" class="counter-button" onclick="${decrement()}">-</button>
    <span id="count" class="counter-value">${state.state.count}</span>
    <button id="increment" class="counter-button" onclick="${increment()}">+</button>
  `;
});
