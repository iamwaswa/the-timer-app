"use client";

import { useReducer } from "react";

import type { TimerInterval } from "@/types";

export function useSequentialTimerIntervals(numIterations: number, timerIntervals: TimerInterval[]) {
  const [timerIntervalIdToEntityMap, timerIntervalRefTree] = createTimerIntervalRef(numIterations, timerIntervals);

  const [{ firstRef, currentRef, nextRef }, dispatch] = useReducer(sequentialTimerIntervalsReducer, {
    firstRef: timerIntervalRefTree,
    currentRef: timerIntervalRefTree,
    nextRef: timerIntervalRefTree?.next ?? null,
  });

  const isLastTimerInterval = nextRef === null && currentRef.id === firstRef.id;

  return {
    currentTimerInterval: timerIntervalIdToEntityMap.get(currentRef.id)!,
    firstTimerInterval: timerIntervalIdToEntityMap.get(firstRef.id)!,
    nextTimerInterval: nextRef?.id ? timerIntervalIdToEntityMap.get(nextRef.id)! : null,
    onAdvanceSequence() {
      if (!isLastTimerInterval) {
        dispatch({ type: "advance-sequence" });
      }
      return nextRef?.id ? timerIntervalIdToEntityMap.get(nextRef.id)! : null;
    },
    onResetSequence() {
      dispatch({ type: "reset-sequence" });
      return timerIntervalIdToEntityMap.get(firstRef.id)!;
    },
  };
}

type TimerIntervalRef = {
  id: string;
  next: TimerIntervalRef | null;
};

function createTimerIntervalRef(
  numIterations: number,
  timerIntervals: TimerInterval[],
): [Map<string, TimerInterval>, TimerIntervalRef] {
  if (numIterations === 0) {
    throw new Error("Number of iterations must be at least 1");
  }

  if (timerIntervals.length === 0) {
    throw new Error("Timer intervals array cannot be empty");
  }

  const map = new Map<string, TimerInterval>();
  let firstRef: TimerIntervalRef = { id: "", next: null };
  let previousRef: TimerIntervalRef = { id: "", next: null };

  let currentIteration = 1;
  do {
    for (let index = 0; index < timerIntervals.length; index++) {
      const timerInterval = timerIntervals[index];

      if (currentIteration === 1 && index === 0) {
        map.set(timerInterval.id, timerInterval);
        firstRef = {
          id: timerInterval.id,
          next: null,
        };
        previousRef = firstRef;
        continue;
      }

      const currentRef: TimerIntervalRef = {
        id: timerInterval.id,
        next: null,
      };
      map.set(currentRef.id, timerInterval);
      previousRef.next = currentRef;
      previousRef = currentRef;
    }

    currentIteration++;
  } while (currentIteration <= numIterations);

  return [map, firstRef];
}

type SequentialTimerIntervalsReducerState = {
  firstRef: TimerIntervalRef;
  currentRef: TimerIntervalRef;
  nextRef: TimerIntervalRef | null;
};

type SequentialTimerIntervalsReducerAction = { type: "reset-sequence" } | { type: "advance-sequence" };

function sequentialTimerIntervalsReducer(
  state: SequentialTimerIntervalsReducerState,
  action: SequentialTimerIntervalsReducerAction,
) {
  switch (action.type) {
    case "advance-sequence":
      return {
        ...state,
        currentRef: state.nextRef ?? state.firstRef,
        nextRef: state.nextRef?.next ?? null,
      };
    case "reset-sequence":
      return {
        ...state,
        currentRef: state.firstRef,
        nextRef: state.firstRef?.next ?? null,
      };
  }
}
