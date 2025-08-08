import { createRxState } from "../framework/State";

export interface CounterState {
  count: number;
}

export const initialState: CounterState = {
  count: 0,
};

export const createCounterState = () =>
  createRxState<CounterState>(initialState);
