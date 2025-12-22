"use client";

import type { Property } from "csstype";
import { useReducer } from "react";

import type { TimerInterval } from "@/types";
import { pickTimerIntervalBackgroundColor } from "@/utils";

export function useSequentialTimerIntervals(numIterations: number, timerIntervals: TimerInterval[]) {
  const [timerIntervalIdToEntityMap, timerIntervalRefTree] = createTimerIntervalRef(numIterations, timerIntervals);

  const [{ firstRef, currentRef, nextRef }, dispatch] = useReducer(sequentialTimerIntervalsReducer, {
    firstRef: timerIntervalRefTree,
    currentRef: timerIntervalRefTree,
    nextRef: timerIntervalRefTree?.next ?? null,
  });

  const isLastTimerInterval = nextRef === null && currentRef.id === firstRef.id;

  return {
    currentBackgroundColor: currentRef.backgroundColor,
    currentTimerInterval: timerIntervalIdToEntityMap.get(currentRef.id)!,
    firstTimerInterval: timerIntervalIdToEntityMap.get(firstRef.id)!,
    nextTimerInterval: nextRef?.id ? timerIntervalIdToEntityMap.get(nextRef.id)! : null,
    advanceSequence() {
      if (!isLastTimerInterval) {
        dispatch({ type: "advance-sequence" });
      }
      return nextRef?.id ? timerIntervalIdToEntityMap.get(nextRef.id)! : null;
    },
    resetSequence() {
      dispatch({ type: "reset-sequence" });
      return timerIntervalIdToEntityMap.get(firstRef.id)!;
    },
  };
}

type TimerIntervalRef = {
  id: string;
  backgroundColor: Property.BackgroundColor;
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
  let firstRef: TimerIntervalRef = { id: "", backgroundColor: "", next: null };
  let previousRef: TimerIntervalRef = { id: "", backgroundColor: "", next: null };

  let currentIteration = 1;
  do {
    for (let index = 0; index < timerIntervals.length; index++) {
      const timerInterval = timerIntervals[index];

      if (currentIteration === 1 && index === 0) {
        map.set(timerInterval.id, timerInterval);
        firstRef = {
          id: timerInterval.id,
          backgroundColor: pickTimerIntervalBackgroundColor(),
          next: null,
        };
        previousRef = firstRef;
        continue;
      }

      map.set(timerInterval.id, timerInterval);
      const currentRef: TimerIntervalRef = {
        id: timerInterval.id,
        backgroundColor: pickTimerIntervalBackgroundColor(),
        next: null,
      };
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
