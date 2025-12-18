"use client";

import { useReducer } from "react";

import type { TimerInterval } from "@/types";

export function useSequentialTimerIntervals(initialNumIterationsLeft: number, timerIntervals: TimerInterval[]) {
  const initialCurrentTimerIntervalIndex = 0;
  const [{ currentTimerIntervalIndex, nextTimerIntervalIndex, numIterationsLeft }, dispatch] = useReducer(
    sequentialTimerIntervalsReducer,
    {
      currentTimerIntervalIndex: initialCurrentTimerIntervalIndex,
      nextTimerIntervalIndex: getNextTimerIntervalIndexFromCurrent(
        initialCurrentTimerIntervalIndex,
        timerIntervals.length,
      ),
      numIterationsLeft: initialNumIterationsLeft,
    },
  );

  return {
    currentTimerIntervalIndex,
    nextTimerIntervalIndex,
    numIterationsLeft,
    onResetAll() {
      dispatch({
        type: "reset-all",
        payload: { initialNumIterations: initialNumIterationsLeft, numTimerIntervals: timerIntervals.length },
      });
    },
    onTimerFinished() {
      dispatch({
        type: "timer-finished",
        payload: { numTimerIntervals: timerIntervals.length },
      });
    },
  };
}

type SequentialTimerIntervalsReducerState = {
  currentTimerIntervalIndex: number;
  nextTimerIntervalIndex: number;
  numIterationsLeft: number;
};

type SequentialTimerIntervalsReducerAction =
  | { payload: { initialNumIterations: number; numTimerIntervals: number }; type: "reset-all" }
  | { payload: { numTimerIntervals: number }; type: "timer-finished" };

function sequentialTimerIntervalsReducer(
  state: SequentialTimerIntervalsReducerState,
  action: SequentialTimerIntervalsReducerAction,
) {
  switch (action.type) {
    case "reset-all":
      if (action.payload.numTimerIntervals > 0) {
        const currentTimerIntervalIndex = 0;
        return {
          ...state,
          numIterationsLeft: action.payload.initialNumIterations,
          currentTimerIntervalIndex,
          nextTimerIntervalIndex: getNextTimerIntervalIndexFromCurrent(
            currentTimerIntervalIndex,
            action.payload.numTimerIntervals,
          ),
        };
      }
      return state;
    case "timer-finished":
      if (state.numIterationsLeft > 0 && action.payload.numTimerIntervals > 0) {
        const currentTimerIntervalIndex = (state.currentTimerIntervalIndex + 1) % action.payload.numTimerIntervals;
        return {
          ...state,
          currentTimerIntervalIndex,
          nextTimerIntervalIndex: getNextTimerIntervalIndexFromCurrent(
            currentTimerIntervalIndex,
            action.payload.numTimerIntervals,
          ),
          numIterationsLeft:
            state.currentTimerIntervalIndex === action.payload.numTimerIntervals - 1
              ? state.numIterationsLeft - 1
              : state.numIterationsLeft,
        };
      }
      return state;
  }
}

function getNextTimerIntervalIndexFromCurrent(currentTimerIntervalIndex: number, numTimerIntervals: number) {
  return numTimerIntervals > 0 ? (currentTimerIntervalIndex + 1) % numTimerIntervals : 0;
}
